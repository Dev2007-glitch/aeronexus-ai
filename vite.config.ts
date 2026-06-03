import path from 'path';
import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    TanStackRouterVite(), // This automatically builds your routes!
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: [
      { find: 'node:async_hooks', replacement: path.resolve(__dirname, 'src/shims/async_hooks.ts') },
      { find: '#tanstack-start-entry', replacement: path.resolve(__dirname, 'src/start.ts') },
      { find: '#tanstack-router-entry', replacement: path.resolve(__dirname, 'src/router.tsx') },
    ],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
});