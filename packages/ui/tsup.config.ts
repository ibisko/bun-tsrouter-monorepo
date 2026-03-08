import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  entryPoints: ['./src/main.ts'],
  format: ['esm'],
  // dts: true,
  external: ['react'],
  // silent: true,
  watch: ['src'],
  ...options,
}));
