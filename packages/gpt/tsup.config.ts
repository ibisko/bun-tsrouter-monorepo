import { defineConfig } from 'tsup';

export default defineConfig(options => [
  {
    ...options,
    entryPoints: ['./src/index.ts'],
    outDir: './dist',
    format: ['esm'],
    dts: true,
    silent: true,
  },
]);
