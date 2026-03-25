import path from 'path';
import { existsSync } from 'fs';
import { spawn } from 'child_process';
import watchman from 'fb-watchman';
import chalk from 'chalk';
import type { WatchmanConfigInfo } from './types';
import { capabilityCheck, ROOT_DIR } from './uitls';
import { WatchmanClient } from './client';

let watchmanclient: WatchmanClient | null = null;

// 通用的互斥锁工具：第一个调用者执行 cb，后续调用者等待第一个完成
function createOnceAsync<T>(cb: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null;
  return () => {
    if (!promise) {
      promise = cb();
    }
    return promise;
  };
}

const getWatchmanClient = createOnceAsync(async () => {
  const client = new watchman.Client();
  // 检查与watchman连接是否成功
  await capabilityCheck(client);
  console.log('与watchman连接成功');
  process.on('SIGINT', () => {
    client.end();
  });
  watchmanclient = new WatchmanClient(client);
  return watchmanclient;
});

async function main() {
  const configIndex = process.argv.findIndex(item => item === '--config');
  let watchConfigTs = path.join(ROOT_DIR, '.watchman.config.ts');
  if (configIndex != -1) {
    const config = process.argv[configIndex + 1];
    if (config) {
      watchConfigTs = path.join(ROOT_DIR, config);
    }
  }

  const _configs = await import(watchConfigTs);
  // console.log('导入配置成功 watchConfigTs:', watchConfigTs);

  const configs: WatchmanConfigInfo = _configs.default;

  for (const step of configs) {
    const stepStartTime = performance.now();
    const promises = [];
    for (const item of step.scripts) {
      const cwd = path.isAbsolute(item.cwd) ? item.cwd : path.join(ROOT_DIR, item.cwd);
      if (!existsSync(cwd)) throw new Error(`${item.cwd} 目录不存在`);
      if ('watch' in item) {
        if (typeof item.watch === 'string') {
          item.watch = [item.watch];
        }
        for (const watch of item.watch) {
          const p = new Promise<void>(async (resolve, reject) => {
            try {
              // 建立对目录的监听
              const wc = await getWatchmanClient();
              const event = await wc.watchProject({
                packageCwd: cwd,
                watch,
                script: item.script,
                suffixs: item.suffixs,
              });
              event.once('close', resolve);
            } catch (error) {
              console.log(error);
              reject(error);
            }
          });
          promises.push(p);
        }
      } else {
        const cmd = item.script.split(/\s+/);
        if (item.isAwait) {
          const p = new Promise<void>(resolve => {
            const proc = spawn(cmd[0], cmd.slice(1), {
              cwd: item.cwd,
              stdio: 'inherit',
            });
            proc.on('close', () => {
              resolve();
            });
          });
          promises.push(p);
        } else {
          spawn(cmd[0], cmd.slice(1), {
            cwd: item.cwd,
            stdio: 'inherit',
          });
        }
      }
    }
    await Promise.all(promises);
    const stepDuration = ~~(performance.now() - stepStartTime);
    console.log('step -', chalk.blue(step.name), `${stepDuration}ms`);
  }
}
main();
