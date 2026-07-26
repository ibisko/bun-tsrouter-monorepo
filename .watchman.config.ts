import type { WatchmanConfigInfo } from './scripts/watchman/types';

const configs: WatchmanConfigInfo = [
  {
    name: 'packages pre build',
    scripts: [
      {
        cwd: 'packages/utils',
        watch: ['src', 'src-server', 'src-web', 'types'],
        script: 'bun tsdown',
      },
      {
        cwd: 'packages/icons',
        watch: ['src'],
        script: 'bun tsdown',
      },
    ],
  },
  {
    name: 'packages',
    scripts: [
      {
        cwd: 'packages/ui',
        watch: 'src',
        script: 'bun tsdown',
      },
      {
        cwd: 'packages/tsrouter',
        watch: ['src-client', 'src-server'],
        script: 'bun tsdown',
      },
      {
        cwd: 'apps/server',
        watch: 'src',
        script: 'bun tsdown',
      },
      {
        cwd: 'packages/gpt',
        watch: 'src',
        script: 'bun tsdown',
      },
    ],
  },
  {
    name: 'apps',
    scripts: [
      {
        cwd: 'apps/server',
        script: 'bun run --watch ./src/main.ts', // 这样能少一个父进程
      },
      {
        cwd: 'apps/web',
        script: 'bun run dev',
      },
    ],
  },
];

export default configs;
