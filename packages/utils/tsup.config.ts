import { defineConfig } from 'tsup';

export default defineConfig(options => [
  {
    ...options,
    entryPoints: ['./src/index.ts'],
    outDir: './dist/src',
    format: ['esm', 'cjs'],
    watch: true,
    dts: true,
    silent: true,
  },
  {
    ...options,
    entryPoints: ['./src-server/index.ts'],
    outDir: './dist/server',
    format: ['esm', 'cjs'],
    watch: true,
    dts: true,
    silent: true,
  },
  {
    ...options,
    entryPoints: ['./src-server/index.ts'],
    outDir: './dist/web',
    format: ['esm', 'cjs'],
    watch: true,
    dts: true,
    silent: true,
  },
]);
