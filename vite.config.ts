import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // or '@vitejs/plugin-vue' depending on your framework

export default defineConfig({
  plugins: [react()],
  root: 'src',            // 1. Tells Vite to look inside the /src folder for index.html
  build: {
    outDir: '../dist',    // 2. Places the final build folder back into the main root directory
    emptyOutDir: true,    // 3. Cleans up old build files before creating new ones
  },
});