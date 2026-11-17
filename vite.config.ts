import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` → normal static site in dist/.
// `npm run build:single` → one self-contained HTML file (used for private previews).
export default defineConfig(({ mode }) => ({
  // Relative base so the site works at any path (e.g. username.github.io/repo/).
  base: './',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: mode === 'single' ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000 } : {},
}))
