import { build } from 'tsup';

Bun.spawn({
  cmd: ['bun', '--watch', '-r', './src/config.ts', './src/main.ts'],
  stdio: ['ignore', 'inherit', 'inherit'],
  env: process.env,
});
build({
  entryPoints: ['./src/main.ts'],
  format: ['esm'],
  // clean: true,
  // dts: true,
  dts: { only: true },
  watch: ['./src/**/*.ts'],
  silent: true, // 禁用tsup日志
});
build({
  entryPoints: ['./prisma/generated/browser.ts'],
  format: ['esm'],
  // clean: true,
  // dts: { only: true },
  watch: ['./src/**/*.ts'],
  silent: true, // 禁用tsup日志
});
// todo prisma browser js导出