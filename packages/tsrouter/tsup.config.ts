import { defineConfig } from 'tsup';
// import path from 'path';

export default defineConfig(options => [
  {
    entry: ['./src-server/main.ts'],
    outDir: './dist/server',
    format: ['esm'],
    watch: true,
    dts: true,
    ...options,
    silent: true, // 禁用tsup日志
  },
  {
    entry: ['./src-client/main.ts'],
    outDir: './dist/client',
    format: ['esm'],
    watch: true,
    dts: true,
    ...options,
    silent: true, // 禁用tsup日志
  },
]);
