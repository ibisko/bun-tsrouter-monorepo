import { defineConfig } from 'tsup';

export default defineConfig(options => [
  {
    ...options,
    entryPoints: ['./generated/client.ts', './generated/browser.ts'],
    format: ['esm'],
    silent: true,
  },
]);
