import { defineConfig } from 'tsup';

export default defineConfig(options => [
  {
    ...options,
    entryPoints: ['./src/main.ts'],
    format: ['esm'],
    dts: { only: true },
    silent: true,
  },
]);
