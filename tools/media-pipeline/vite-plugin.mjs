import path from 'node:path';
import { MEDIA_PIPELINE_VERSION, mediaPipelineConfig } from './config.mjs';
import { transformMediaJsx } from './jsx-transform.mjs';
import { optimizeOutputMedia } from './optimizer.mjs';

export function mediaPipeline(userConfig = {}) {
  const config = {
    ...mediaPipelineConfig,
    ...userConfig,
    image: { ...mediaPipelineConfig.image, ...userConfig.image },
    video: { ...mediaPipelineConfig.video, ...userConfig.video },
    loading: { ...mediaPipelineConfig.loading, ...userConfig.loading },
    budgets: { ...mediaPipelineConfig.budgets, ...userConfig.budgets },
  };
  let resolved;

  return {
    name: 'transev-media-pipeline',
    enforce: 'pre',
    apply: 'build',
    config() {
      return {
        build: {
          rollupOptions: {
            output: {
              assetFileNames: `assets/[name]-[hash]-m${MEDIA_PIPELINE_VERSION}[extname]`,
            },
          },
        },
      };
    },
    configResolved(viteConfig) {
      resolved = viteConfig;
    },
    transform(code, id) {
      return transformMediaJsx(code, id, config.loading);
    },
    async writeBundle() {
      const outDir = path.resolve(resolved.root, resolved.build.outDir);
      await optimizeOutputMedia({ outDir, root: resolved.root, config, logger: resolved.logger });
    },
  };
}
