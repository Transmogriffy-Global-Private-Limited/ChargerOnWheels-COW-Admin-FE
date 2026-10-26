import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { mediaPipeline } from './tools/media-pipeline/vite-plugin.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mediaPipeline(),
    react(),
    tailwindcss(),
  ],
  server:{
    host: '0.0.0.0'
  }
})
