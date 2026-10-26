# Media pipeline

This directory owns production media optimization. It is intentionally isolated from application components.

## Automatic behavior

- Production Vite builds inject `loading` and `decoding` into rendered images.
- Assets named like `hero`, `logo`, `lcp`, `above-the-fold`, `thunder`, or `up` are eager; other images are lazy by default.
- Videos receive `preload="metadata"` and `playsInline` unless explicitly configured in JSX.
- Emitted images and videos are optimized in `dist/`; source assets are never modified.
- Results are cached in `.cache/media-pipeline` using the source bytes, settings, and pipeline version.
- The pipeline version is included in emitted asset URLs so a version bump invalidates immutable browser caches.
- Production builds fail when an optimized output exceeds the failure budget in `config.mjs`.
- Prerender builds verify every generated HTML file.

## Developer contract

Import media normally. Do not add optimizer-specific import query strings.

Name an above-the-fold asset with `hero`, `logo`, or `lcp`, or explicitly set `loading="eager"`. Explicit JSX attributes always take precedence over automatic defaults.

Use `npm run build:prerender` for deployable output. Do not edit `dist/` by hand.

When changing optimizer settings in a way that should invalidate long-lived deployed asset caches, increment `MEDIA_PIPELINE_VERSION` in `config.mjs`.

CI may set `MEDIA_PIPELINE_CACHE_DIR` to place the content cache on a persistent build volume.
`PRERENDER_DIST_DIR` and `MEDIA_PIPELINE_DIST_DIR` may be set when build artifacts live outside the default `dist/` directory.
