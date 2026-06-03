import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: false, // Disable CSS minification (lightningcss has issues with our CSS structure)
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/vitest.setup.ts'],
  },
});