import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [angular({ tsconfig: './tsconfig.spec.json' })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [fileURLToPath(new URL('./test/setup.ts', import.meta.url))],
    include: ['src/**/*.spec.ts'],
  },
});