import { defineConfig } from 'tsup';

export default defineConfig(options => [
  {
    ...options,
    entry: ['./src-server/main.ts'],
    outDir: './dist/server',
    format: ['esm'],
    dts: true,
  },
  {
    ...options,
    entry: ['./src-client/main.ts'],
    outDir: './dist/client',
    format: ['esm'],
    dts: true,
  },
]);
