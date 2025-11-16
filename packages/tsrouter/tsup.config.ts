import { defineConfig } from 'tsup';
// import path from 'path';

export default defineConfig(options => [
  {
    ...options,
    entry: ['./src-server/main.ts'],
    outDir: './dist/server',
    format: ['esm'],
    watch: true,
    dts: true,
    silent: true,
  },
  {
    ...options,
    entry: ['./src-client/main.ts'],
    outDir: './dist/client',
    format: ['esm'],
    watch: true,
    dts: true,
    silent: true,
  },
]);
