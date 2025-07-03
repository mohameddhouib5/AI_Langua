import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',   // set root to your public folder where index.html is
  build: {
    outDir: '../dist', // output the build to project-root/dist
    emptyOutDir: true
  }
});
