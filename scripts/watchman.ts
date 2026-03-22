import path from 'path';
import { existsSync } from 'fs';
import { spawn } from 'child_process';
import watchman, { type Expression } from 'fb-watchman';
import chalk from 'chalk';
import EventEmitter from 'events';

const ROOT_DIR = path.join(__dirname, '..');
const DEFAULT_FILTERS = ['ts', 'cts', 'tsx', 'js', 'cjs', 'jsx'];

class WatchmanClient {
  private client: watchman.Client;

  /** `packageCwd:script` 作为唯一标识，记录 Timeout 和 Event */
  private dirWatchState = new Map<string, DirWatchState>();

  constructor(client: watchman.Client) {
    this.client = client;
    client.on('subscription', resp => {
      for (const [_, val] of this.dirWatchState.entries()) {
        val.callback(resp);
      }
    });
  }

  async watchProject({ packageCwd, watch, script, suffixs = [] }: WatchProjectParam) {
    const watchDir = path.join(packageCwd, watch);
    const relativePath = await getWatchProjectRelativePath(this.client, watchDir);
    if (!relativePath) throw new Error();

    // 注册订阅
    const suffixExpressions: Expression[] = DEFAULT_FILTERS.concat(suffixs).map(item => ['suffix', item]);
    // console.log(...expressionItems);
    const sub: watchman.SubscriptionConfig = {
      expression: ['anyof', ...suffixExpressions],
      fields: ['name', 'size', 'mtime_ms', 'exists', 'type'],
      relative_root: relativePath,
    };

    const subscribeName = Bun.hash(watchDir).toString(16);

    // 注册事件
    const sign = Bun.hash(`${packageCwd}:${script}`).toString(16);
    // console.log('注册事件', relativePath, { sign });
    let info = this.dirWatchState.get(sign);
    if (!info) {
      const event = new EventEmitter();
      this.dirWatchState.set(sign, {
        throttleTimeout: null,
        event,
        callback: (resp: watchman.SubscriptionResponse) => {
          if (resp.subscription !== subscribeName) return;
          // console.log('resp.subscription:', resp.subscription);
          this.spawnHandle({ sign, script, packageCwd, relativePath: relativePath });
        },
      });
      info = this.dirWatchState.get(sign)!;
    }

    // console.log('注册订阅', relativePath, { subscribeName, relativePath, sub });
    // console.log('注册订阅', relativePath, { subscribeName });
    await new Promise((resolve, reject) => {
      this.client.command(['subscribe', ROOT_DIR, subscribeName, sub], error => {
        return error ? reject(error) : resolve(null);
      });
    });

    // todo 监听订阅仅一次即可
    // console.log('监听订阅', relativePath);
    // this.client.on('subscription', async _resp => {});

    // todo 返回event，便于让外面操作？
    return info.event;
  }

  subscription(resp: watchman.SubscriptionResponse) {
    for (const [_, val] of this.dirWatchState.entries()) {
      val.callback(resp);
    }
  }

  // 根据路径和脚本执行的节流器
  private async spawnHandle({ sign, script, packageCwd, relativePath }: SpawnHandleParam) {
    const state = this.dirWatchState.get(sign)!;
    if (state.throttleTimeout) {
      // todo  这里会让外面的await一直等待了，所以不能 await spawnHandle!
      // event.emit('exit');
      clearTimeout(state.throttleTimeout);
    }
    const startTime = performance.now();

    const time = setTimeout(
      () => {
        const cmd = script.split(/\s+/);
        const proc = spawn(cmd[0], cmd.slice(1), {
          cwd: packageCwd,
          stdio: 'inherit',
          // stdio: 'ignore',
        });
        // console.log(chalk.gray(relativePath), `${chalk.green(script)} - Start`);
        // on("close") 最稳，通过code来判断是否有异常
        proc.on('close', code => {
          // todo 触发 event:close 事件
          const duration = ~~(performance.now() - startTime);
          console.log(chalk.gray(relativePath), `${chalk.green(script)} - ${duration}ms`);
          state.throttleTimeout = null;
          this.dirWatchState.set(sign, state);
          state.event.emit('close');
          // return code === 0 ? resolve(null) : reject(code);
        });
      },
      state.throttleTimeout ? 100 : 0,
    );
    state.throttleTimeout = time;
    this.dirWatchState.set(sign, state);
  }
}

const capabilityCheck = (client: watchman.Client) =>
  new Promise((resolve, reject) =>
    client.capabilityCheck({ optional: [], required: ['relative_root'] }, (error, resp) => (error ? reject(error) : resolve(resp))),
  );

const getWatchProjectRelativePath = (client: watchman.Client, watchDir: string) =>
  new Promise<string | undefined>((resolve, reject) => {
    client.command(['watch-project', watchDir], (error, resp) => {
      if (error) {
        console.error('Error initiating watch:', error);
        return reject(error);
      }
      if ('warning' in resp) {
        console.warn('warning: ', resp.warning);
      }
      // console.log('RESP relative_path:', resp.relative_path);
      resolve(resp.relative_path);
    });
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

  const client = new watchman.Client();
  // 检查与watchman连接是否成功
  await capabilityCheck(client);
  console.log('与watchman连接成功');
  process.on('SIGINT', () => {
    console.log('process SIGINT');
    client.end();
  });

  const wc = new WatchmanClient(client);
  const _configs = await import(watchConfigTs);
  console.log('导入配置成功 watchConfigTs:', watchConfigTs);

  const configs: WatchmanConfigInfo = _configs.default;

  for (const step of configs) {
    const stepStartTime = performance.now();
    for (const item of step.scripts) {
      const cwd = path.isAbsolute(item.cwd) ? item.cwd : path.join(ROOT_DIR, item.cwd);
      if (!existsSync(cwd)) throw new Error(`${item.cwd} 目录不存在`);
      const promises = [];
      if ('watch' in item) {
        if (typeof item.watch === 'string') {
          item.watch = [item.watch];
        }
        for (const watch of item.watch) {
          const p = new Promise<void>(async (resolve, reject) => {
            try {
              // 建立对目录的监听
              console.log('建立对目录的监听', cwd);
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
      await Promise.all(promises);
    }
    const stepDuration = ~~(performance.now() - stepStartTime);
    console.log('step:', chalk.green(step.name), `${stepDuration}ms`);
  }
  client.end();
}
main();

export type WatchmanConfigInfo = Step[];

type Step = {
  name: string;
  scripts: (RunScript | WatchScript)[];
};
type RunScript = {
  cwd: string;
  script: string;
  isAwait?: boolean;
};
type WatchScript = {
  cwd: string;
  script: string;
  watch: string | string[];
  /**
   * 过滤文件表达式，默认: ts, cts, tsx, js, cjs, jsx
   */
  suffixs?: string[];
};

type WatchProjectParam = {
  packageCwd: string;
  watch: string;
  script: string;
  suffixs?: string[];
};

type SpawnHandleParam = {
  sign: string;
  script: string;
  packageCwd: string;
  relativePath?: string;
};

type DirWatchState = {
  throttleTimeout: NodeJS.Timeout | null;
  event: EventEmitter;
  callback: (resp: watchman.SubscriptionResponse) => void;
};
