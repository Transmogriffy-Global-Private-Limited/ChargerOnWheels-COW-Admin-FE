# Developer-only instructions

## Media pipeline

- All production media behavior is owned by `tools/media-pipeline/`. Keep optimization logic out of React components.
- Import images and videos normally from `src/assets`; the production build optimizes emitted media automatically.
- Ordinary images default to lazy loading. Use a filename containing `hero`, `logo`, or `lcp`, or set `loading="eager"` explicitly, only for above-the-fold/LCP media.
- Explicit `loading`, `decoding`, `fetchPriority`, `preload`, and `playsInline` JSX properties override or complement automatic defaults.
- Never edit generated files in `dist/`.
- Run `npm run build:prerender` before deployment. It must finish media optimization and HTML verification successfully.
- If media quality, encoding, cache behavior, or budgets change, update `tools/media-pipeline/config.mjs` and increment `MEDIA_PIPELINE_VERSION` when browser cache invalidation is required.
