import type { WatchmanConfigInfo } from './scripts/watchman';

const configs: WatchmanConfigInfo = {
  apps: [
    {
      cwd: 'apps/server',
      script: 'bun run dev',
    },
    {
      cwd: 'apps/web',
      script: 'bun run dev',
    },
  ],
  // todo 分阶段
  packages: [
    {
      cwd: 'packages/gpt',
      watch: 'src',
      script: 'bun tsup',
    },
    {
      cwd: 'packages/utils',
      watch: ['src', 'src-server', 'src-web', 'types'],
      script: 'bun tsup',
    },
    {
      cwd: 'packages/ui',
      watch: 'src',
      script: 'bun tsup',
    },
    {
      cwd: 'packages/tsrouter',
      watch: ['src-client', 'src-server'],
      script: 'bun tsup',
    },
    {
      cwd: 'apps/server',
      watch: 'src',
      script: 'bun run build-dts',
    },
  ],
};

export default configs;
