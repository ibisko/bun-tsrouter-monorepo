import path from 'path';
import { spawn } from 'child_process';
import watchman, { type Expression } from 'fb-watchman';
import chalk from 'chalk';
import type { SpawnHandleParam, WatchProjectParam } from './types';
import { DEFAULT_FILTERS, getWatchProjectRelativePath, ROOT_DIR } from './uitls';
import { DirWatchState } from './dirWatchState';

export class WatchmanClient {
  private client: watchman.Client;

  /** `packageCwd:script` 作为唯一标识，记录 Timeout 和 Event */
  private dirWatchState = new Map<string, DirWatchState>();

  constructor(client: watchman.Client) {
    this.client = client;
    /** 全部订阅都触发了一遍 */
    client.on('subscription', resp => {
      for (const [_, val] of this.dirWatchState.entries()) {
        val.callback(resp);
      }
    });
  }

  async watchProject({ packageCwd, watch, script, suffixs = [], env }: WatchProjectParam) {
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
    // console.log({ relativePath, watchDir, packageCwd, script, sign, subscribeName });
    // console.log('注册事件', relativePath, { sign });
    let dws = this.dirWatchState.get(sign);
    if (dws) {
      dws.subscribeNames.push(subscribeName);
    } else {
      dws = new DirWatchState({ sign, script, packageCwd, relativePath, env, spawnHandle: this.spawnHandle.bind(this) });
      dws.subscribeNames.push(subscribeName);
      this.dirWatchState.set(sign, dws);
    }

    // console.log({ subscribeName, sub });

    await new Promise((resolve, reject) => {
      this.client.command(['subscribe', ROOT_DIR, subscribeName, sub], error => {
        return error ? reject(error) : resolve(null);
      });
    });

    return dws.event;
  }

  // 根据路径和脚本执行的节流器
  private async spawnHandle({ sign, script, packageCwd, relativePath, env }: SpawnHandleParam) {
    const state = this.dirWatchState.get(sign);
    if (!state) return;
    if (state.throttleTimeout) {
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
          env,
        });
        // console.log(chalk.gray(relativePath), `${chalk.green(script)} - Start`);
        // on("close") 最稳，通过code来判断是否有异常
        proc.on('close', code => {
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
