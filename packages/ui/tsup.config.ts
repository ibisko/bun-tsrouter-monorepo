import { defineConfig } from 'tsup';
import { spawn, spawnSync } from 'child_process';

export default defineConfig(options => ({
  entryPoints: ['./src/main.tsx'],
  format: ['esm'],
  dts: true,
  external: ['react'],
  // silent: true,
  watch: ['src'],
  ...options,
  async onSuccess() {
    spawnSync('npx', '@tailwindcss/cli -i ./src/styles/global.css -o ./dist/index.css'.split(/\s+/));
  },
}));
