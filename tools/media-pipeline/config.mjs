export const MEDIA_PIPELINE_VERSION = '1';

export const mediaPipelineConfig = {
  cacheDir: process.env.MEDIA_PIPELINE_CACHE_DIR || '.cache/media-pipeline',
  image: {
    minimumBytes: 4 * 1024,
    jpegQuality: 80,
    pngQuality: 80,
    webpQuality: 78,
    avifQuality: 55,
  },
  video: {
    minimumBytes: 512 * 1024,
    maxWidth: 1920,
    maxFps: 30,
    mp4Crf: 28,
    webmCrf: 34,
    audioBitrate: '128k',
    preset: 'medium',
  },
  loading: {
    eagerAssetPattern: /(?:^|[/_.-])(hero|logo|lcp|above[-_]?the[-_]?fold|thunder|up)(?:[/_.-]|$)/i,
  },
  budgets: {
    imageWarningBytes: 500 * 1024,
    imageFailureBytes: 2.5 * 1024 * 1024,
    videoWarningBytes: 6 * 1024 * 1024,
    videoFailureBytes: 15 * 1024 * 1024,
  },
};
