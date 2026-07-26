import { defineConfig } from 'tsdown';

export default defineConfig(options => [
  {
    ...options,
    entry: ['./src/index.ts'],
    outDir: './dist',
    format: ['esm'],
    dts: true,
    deps: { neverBundle: true },
  },
]);
