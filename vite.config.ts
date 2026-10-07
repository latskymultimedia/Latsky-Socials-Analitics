import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  return {
    // For Vercel deployments (process.env.VERCEL), use root '/'
    // For GitHub Pages build (command === 'build'), use repository subfolder
    // In dev server (command === 'serve'), use root '/' for instant loading in AI Studio preview
    base: process.env.VERCEL ? '/' : (command === 'build' ? '/Latsky-Socials-Analitics/' : '/'),
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var or container proxy.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: false,
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
