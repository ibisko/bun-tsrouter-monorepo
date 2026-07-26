import type { WatchmanConfigInfo } from './scripts/watchman/types';

const configs: WatchmanConfigInfo = [
  {
    name: 'packages pre build',
    scripts: [
      {
        cwd: 'packages/utils',
        script: 'bun tsdown',
        isAwait: true,
      },
      {
        cwd: 'packages/icons',
        script: 'bun tsdown',
        isAwait: true,
      },
    ],
  },
  {
    name: 'packages build',
    scripts: [
      {
        cwd: 'packages/ui',
        script: 'bun tsdown',
        isAwait: true,
      },
      {
        cwd: 'packages/tsrouter',
        script: 'bun tsdown',
        isAwait: true,
      },
      {
        cwd: 'apps/server',
        script: 'bun tsdown',
        isAwait: true,
      },
      {
        cwd: 'packages/gpt',
        script: 'bun tsdown',
        isAwait: true,
      },
    ],
  },

  // app/server
  {
    name: 'apps/server generate',
    scripts: [
      {
        cwd: 'apps/server',
        script: 'bun run generate',
        isAwait: true,
      },
    ],
  },
  {
    name: 'apps/server diff',
    scripts: [
      {
        cwd: 'apps/server',
        script: 'bun run diff',
        isAwait: true,
      },
    ],
  },
  {
    name: 'apps/server execute',
    scripts: [
      {
        cwd: 'apps/server',
        script: 'bun run execute',
        isAwait: true,
      },
    ],
  },

  // agent/server
  {
    name: 'agent/server generate',
    scripts: [
      {
        cwd: 'agent/server',
        script: 'bun run generate',
        isAwait: true,
      },
    ],
  },
  {
    name: 'agent/server diff',
    scripts: [
      {
        cwd: 'agent/server',
        script: 'bun run diff',
        isAwait: true,
      },
    ],
  },
  {
    name: 'agent/server execute',
    scripts: [
      {
        cwd: 'agent/server',
        script: 'bun run execute',
        isAwait: true,
      },
    ],
  },
];

export default configs;
