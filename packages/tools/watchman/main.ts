import path from 'path';
import { promises as fs } from 'fs';
import { Client } from 'fb-watchman';
import { WatchmanClient } from './watchman';
import { TsdownActions } from './TsdownActions';
import { spawnHandle, WaitInit } from './uitls';
import { repo } from './repo';
export { defineConfig } from './TsdownActions';

async function dev(isAgentApp?: boolean) {
  const waitInit = new WaitInit();
  const mapSubscription = new Map<string, () => Promise<void>>();
  const _client = new Client();
  _client.on('subscription', async resp => {
    await mapSubscription.get(resp.subscription)?.();
    waitInit.exec(resp.subscription);
  });

  const client = new WatchmanClient(_client);
  await client.capabilityCheck();
  const { watch: RootDir } = await client.watchProject(__dirname);

  const tsdownActions = new TsdownActions(RootDir);
  const buildConfigs = await repo(tsdownActions);
  for (const item of buildConfigs) {
    const subscriptionName = `tsdown:${item.relativePath}`;
    mapSubscription.set(subscriptionName, item.action);
    const dirPath = path.join(RootDir, item.relativePath);
    waitInit.add(subscriptionName);
    await client.subscribe(dirPath, subscriptionName);
  }

  await waitInit.wait();

  if (isAgentApp) {
    spawnHandle('bun run --watch --no-clear-screen ./src/main.ts', path.join(RootDir, './agent/server'));
    spawnHandle('bun run dev', path.join(RootDir, './agent/web'));
  } else {
    spawnHandle('bun run --watch --no-clear-screen ./src/main.ts', path.join(RootDir, './apps/server'));
    spawnHandle('bun run dev', path.join(RootDir, './apps/web'));
  }
}

// todo init
async function init() {
  const cwd = process.cwd();
  const pnpmWrokspaceYamlFilePath = path.join(cwd, 'pnpm-workspace.yaml');
  if (!(await fs.exists(pnpmWrokspaceYamlFilePath))) {
    throw new Error('当前目录不存在 pnpm-workspace.yaml');
  }
  const tsdownActions = new TsdownActions(cwd);
  const buildConfigs = await repo(tsdownActions);
  for (const item of buildConfigs) {
    item.action();
  }
}

async function main() {
  if (process.argv.includes('--dev')) {
    await dev();
  } else if (process.argv.includes('--agent')) {
    await dev(true);
  } else if (process.argv.includes('--init')) {
    await init();
  } else {
    console.log(`unkow options`);
  }
}

main();
