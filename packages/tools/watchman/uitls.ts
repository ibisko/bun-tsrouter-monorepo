import chalk from 'chalk';
import { EventEmitter } from 'events';
import type { InlineConfig } from 'tsdown';

export const tsdownDefaultOptions: InlineConfig = {
  format: ['esm'],
  dts: { tsgo: true },
  deps: { neverBundle: true },
  clean: false,
  logLevel: 'warn',
};

export const tsdownServerOptions: InlineConfig = {
  format: ['esm'],
  dts: { emitDtsOnly: true, tsgo: true },
  clean: false,
  logLevel: 'warn',
};

export const startTimer = (prefix: string) => {
  const start = performance.now();
  return () => {
    const ms = ~~(performance.now() - start);
    const d = ms < 1e3 ? `${ms}ms` : `${ms / 1e3}s`;
    console.log(`${chalk.gray(prefix)} - ${chalk.greenBright(d)}`);
  };
};

export const spawnHandle = async (cmds: string, cwd: string) => {
  const _cmds = cmds.split(/\s+/);
  const proc = Bun.spawn(_cmds, {
    cwd: cwd,
    stdout: 'inherit',
    stderr: 'inherit',
  });
  await proc.exited;
};

// 确保每个 watch 的 tsdown 任务都执行过一遍后再允许通行
export class WaitInit {
  private mapNames = new Map<string, boolean>();
  private event = new EventEmitter();
  private ready = false;

  add(name: string) {
    this.mapNames.set(name, false);
    this.ready = false;
  }

  exec(name: string) {
    if (this.ready) return;
    this.mapNames.set(name, true);
    const ready = this.mapNames.entries().every(([_, bool]) => bool);
    if (ready) {
      this.event.emit('ready', true);
      this.ready = true;
    }
  }

  async wait() {
    if (this.ready) return;
    return new Promise<void>(resolve => {
      this.event.once('ready', resolve);
    });
  }
}
