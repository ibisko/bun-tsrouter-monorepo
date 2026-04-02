import { build } from 'tsup';

Bun.spawn({
  cmd: ['bun', 'run', '--watch', './src/main.ts'],
  stdio: ['ignore', 'inherit', 'inherit'],
  env: process.env,
});
build({
  entryPoints: ['./src/main.ts'],
  format: ['esm'],
  dts: { only: true },
  watch: ['./src/**/*.ts'],
  silent: true, // 禁用tsup日志
});
