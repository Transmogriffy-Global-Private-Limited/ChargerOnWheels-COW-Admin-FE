import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { mediaPipeline } from './tools/media-pipeline/vite-plugin.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [
      mediaPipeline(),
      react(),
      tailwindcss(),
    ],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://192.168.0.101:18080',
          changeOrigin: true,
        },
      },
    },
  }
})
