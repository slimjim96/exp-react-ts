import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/exp-react-app-ts/setupTests.ts',
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/exp-react-app-ts'),
    },
  },
});
