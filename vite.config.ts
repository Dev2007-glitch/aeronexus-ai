import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    TanStackRouterVite(), // This automatically builds your routes!
    react(),
    tsconfigPaths(),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
});