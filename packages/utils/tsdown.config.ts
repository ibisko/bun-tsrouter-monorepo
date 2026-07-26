import { defineConfig } from 'tsdown';

export default defineConfig(options => [
  {
    ...options,
    entry: './src/index.ts',
    outDir: './dist/src',
    format: ['esm'],
    dts: true,
    deps: { neverBundle: true },
  },
  {
    ...options,
    entry: './src-server/index.ts',
    outDir: './dist/server',
    format: ['esm'],
    dts: true,
    deps: { neverBundle: true },
  },
  {
    ...options,
    entry: './src-web/index.ts',
    outDir: './dist/web',
    format: ['esm'],
    dts: true,
    deps: { neverBundle: true },
  },
]);
