import fs from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve(process.env.MEDIA_PIPELINE_DIST_DIR || 'dist');

async function listHtml(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listHtml(file));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(file);
  }
  return files;
}

const htmlFiles = await listHtml(DIST_DIR);
let images = 0;
let lazyImages = 0;
let eagerImages = 0;
let videos = 0;
const invalid = [];

for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    images += 1;
    if (/\bloading=["']lazy["']/i.test(match[0])) lazyImages += 1;
    else if (/\bloading=["']eager["']/i.test(match[0])) eagerImages += 1;
    else invalid.push(`${path.relative(DIST_DIR, file)}: image without loading policy`);
    if (!/\bdecoding=["']async["']/i.test(match[0])) {
      invalid.push(`${path.relative(DIST_DIR, file)}: image without async decoding`);
    }
  }
  for (const match of html.matchAll(/<video\b[^>]*>/gi)) {
    videos += 1;
    if (!/\bpreload=["']metadata["']/i.test(match[0])) invalid.push(`${path.relative(DIST_DIR, file)}: video without metadata preload`);
    if (!/\bplaysinline(?:\s|=|>)/i.test(match[0])) invalid.push(`${path.relative(DIST_DIR, file)}: video without playsInline`);
  }
}

if (invalid.length) {
  console.error(`[media-pipeline] verification failed:\n${invalid.map((item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}

console.log(`[media-pipeline] verified ${htmlFiles.length} HTML files: ${images} images (${lazyImages} lazy, ${eagerImages} eager), ${videos} videos`);
