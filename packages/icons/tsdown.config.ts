import { defineConfig } from 'tsdown';

export default defineConfig(options => [
  {
    ...options,
    entry: ['./src/main.ts'],
    format: ['esm'],
    deps: { neverBundle: true },
  },
]);
