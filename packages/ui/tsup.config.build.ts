import { defineConfig } from 'tsup';
import { spawnSync } from 'child_process';

export default defineConfig(options => ({
  ...options,
  entryPoints: ['./src/main.ts'],
  format: ['esm'],
  external: ['react'],
}));
