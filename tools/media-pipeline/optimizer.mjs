import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';
import { optimize as optimizeSvg } from 'svgo';
import { MEDIA_PIPELINE_VERSION } from './config.mjs';

const IMAGE_EXTENSIONS = new Set(['.avif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const VIDEO_EXTENSIONS = new Set(['.mov', '.mp4', '.webm']);

function digest(buffer, settings) {
  return crypto
    .createHash('sha256')
    .update(MEDIA_PIPELINE_VERSION)
    .update(JSON.stringify(settings))
    .update(buffer)
    .digest('hex');
}

async function fromCache(cacheDir, key, extension, producer) {
  const cacheFile = path.join(cacheDir, `${key}${extension}`);
  try {
    return { buffer: await fs.readFile(cacheFile), cached: true };
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const buffer = await producer();
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(cacheFile, buffer);
  return { buffer, cached: false };
}

async function optimizeImage(input, extension, config) {
  if (extension === '.svg') {
    const result = optimizeSvg(input.toString('utf8'), { multipass: true });
    return Buffer.from(result.data);
  }
  let pipeline = sharp(input, { animated: true }).rotate();
  if (extension === '.jpg' || extension === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: config.jpegQuality, mozjpeg: true });
  } else if (extension === '.png') {
    pipeline = pipeline.png({ quality: config.pngQuality, compressionLevel: 9 });
  } else if (extension === '.webp') {
    pipeline = pipeline.webp({ quality: config.webpQuality, effort: 5 });
  } else if (extension === '.avif') {
    pipeline = pipeline.avif({ quality: config.avifQuality, effort: 5 });
  }
  return pipeline.toBuffer();
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}: ${stderr.slice(-2000)}`));
    });
  });
}

async function optimizeVideo(input, extension, config, cacheDir) {
  if (!ffmpegPath) throw new Error('ffmpeg-static did not provide a binary for this platform.');
  const temporaryDir = await fs.mkdtemp(path.join(cacheDir, 'ffmpeg-'));
  const inputFile = path.join(temporaryDir, `input${extension}`);
  const outputFile = path.join(temporaryDir, `output${extension}`);
  try {
    await fs.writeFile(inputFile, input);
    const scale = `scale='min(${config.maxWidth},iw)':-2:force_original_aspect_ratio=decrease`;
    const common = [
      '-y', '-i', inputFile,
      '-map_metadata', '-1',
      '-vf', scale,
      '-r', String(config.maxFps),
    ];
    const codec = extension === '.webm'
      ? ['-c:v', 'libvpx-vp9', '-crf', String(config.webmCrf), '-b:v', '0', '-c:a', 'libopus', '-b:a', config.audioBitrate]
      : ['-c:v', 'libx264', '-preset', config.preset, '-crf', String(config.mp4Crf), '-c:a', 'aac', '-b:a', config.audioBitrate, '-movflags', '+faststart'];
    await run(ffmpegPath, [...common, ...codec, outputFile]);
    return await fs.readFile(outputFile);
  } finally {
    await fs.rm(temporaryDir, { recursive: true, force: true });
  }
}

async function listFiles(directory) {
  const output = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await listFiles(file));
    else if (entry.isFile()) output.push(file);
  }
  return output;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MiB`;
}

export async function optimizeOutputMedia({ outDir, root, config, logger }) {
  const cacheDir = path.resolve(root, config.cacheDir);
  await fs.mkdir(cacheDir, { recursive: true });
  const files = await listFiles(outDir);
  const report = { processed: 0, cached: 0, skipped: 0, originalBytes: 0, outputBytes: 0, warnings: [], failures: [] };

  for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    const isImage = IMAGE_EXTENSIONS.has(extension);
    const isVideo = VIDEO_EXTENSIONS.has(extension);
    if (!isImage && !isVideo) continue;
    const input = await fs.readFile(file);
    const settings = isImage ? config.image : config.video;
    if (input.length < settings.minimumBytes) {
      report.skipped += 1;
      continue;
    }
    const key = digest(input, { extension, settings });
    const result = await fromCache(cacheDir, key, extension, () => (
      isImage
        ? optimizeImage(input, extension, config.image)
        : optimizeVideo(input, extension, config.video, cacheDir)
    ));
    const output = result.buffer.length < input.length ? result.buffer : input;
    if (output !== input) await fs.writeFile(file, output);
    report.processed += 1;
    if (result.cached) report.cached += 1;
    report.originalBytes += input.length;
    report.outputBytes += output.length;

    const relative = path.relative(outDir, file);
    const warningLimit = isImage ? config.budgets.imageWarningBytes : config.budgets.videoWarningBytes;
    const failureLimit = isImage ? config.budgets.imageFailureBytes : config.budgets.videoFailureBytes;
    if (output.length > failureLimit) report.failures.push(`${relative}: ${formatBytes(output.length)}`);
    else if (output.length > warningLimit) report.warnings.push(`${relative}: ${formatBytes(output.length)}`);
  }

  const saved = report.originalBytes - report.outputBytes;
  logger.info(`[media-pipeline] ${report.processed} optimized (${report.cached} cached), ${report.skipped} small files skipped, ${formatBytes(saved)} saved`);
  for (const warning of report.warnings) logger.warn(`[media-pipeline] size warning: ${warning}`);
  if (report.failures.length) {
    throw new Error(`Media budget exceeded:\n${report.failures.map((failure) => `- ${failure}`).join('\n')}`);
  }
  return report;
}
