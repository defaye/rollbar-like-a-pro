import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

// Plugin to copy manifest and public assets to dist
function copyPublicAssets() {
  return {
    name: 'copy-public-assets',
    closeBundle() {
      mkdirSync('dist', { recursive: true });
      copyFileSync('public/manifest.json', 'dist/manifest.json');
      console.log('Copied manifest.json to dist/');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyPublicAssets()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content-combined.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: 'iife', // IIFE format for Chrome extensions
        inlineDynamicImports: true, // Bundle everything into single file
      },
    },
    // Target modern browsers (Chrome extension context)
    target: 'esnext',
    // Source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',
  },
});
