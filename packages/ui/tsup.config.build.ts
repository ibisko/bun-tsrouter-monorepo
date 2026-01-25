import { defineConfig } from 'tsup';
import { spawnSync } from 'child_process';

export default defineConfig(options => ({
  ...options,
  entryPoints: ['./src/main.ts'],
  format: ['esm'],
  external: ['react'],
  async onSuccess() {
    spawnSync('npx', '@tailwindcss/cli -i ./src/styles/global.css -o ./dist/index.css'.split(/\s+/));
  },
}));
