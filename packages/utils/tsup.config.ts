import { defineConfig } from 'tsup';

export default defineConfig(options => [
  {
    ...options,
    entryPoints: ['./src/index.ts'],
    outDir: './dist/src',
    format: ['esm'],
    dts: true,
    silent: true,
  },
  {
    ...options,
    entryPoints: ['./src-server/index.ts'],
    outDir: './dist/server',
    format: ['esm'],
    dts: true,
    silent: true,
  },
  {
    ...options,
    entryPoints: ['./src-web/index.ts'],
    outDir: './dist/web',
    format: ['esm'],
    dts: true,
    silent: true,
  },
]);
