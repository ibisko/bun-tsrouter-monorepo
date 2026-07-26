import { defineConfig } from 'tsdown';
// import path from 'path';

export default defineConfig(options => [
  {
    ...options,
    entry: ['./src-server/main.ts'],
    outDir: './dist/server',
    format: ['esm'],
    dts: true,
    deps: { neverBundle: true },
  },
  {
    ...options,
    entry: ['./src-client/main.ts'],
    outDir: './dist/client',
    format: ['esm'],
    dts: true,
    deps: { neverBundle: true },
  },
]);
