import watchman from 'fb-watchman';
import EventEmitter from 'events';
import { SpawnHandleParam } from './types';

export class DirWatchState {
  event = new EventEmitter();
  subscribeNames: string[] = [];

  throttleTimeout?: NodeJS.Timeout | null = null;

  sign: string;
  script: string;
  packageCwd: string;
  relativePath: string;
  env?: NodeJS.ProcessEnv;
  spawnHandle: DirWatchStateProps['spawnHandle'];

  constructor({ sign, script, packageCwd, relativePath, env, spawnHandle }: DirWatchStateProps) {
    this.spawnHandle = spawnHandle;
    this.sign = sign;
    this.script = script;
    this.packageCwd = packageCwd;
    this.relativePath = relativePath;
    this.env = env;
  }

  addSubscribeName(subscribeName: string) {
    this.subscribeNames.push(subscribeName);
  }

  callback(resp: watchman.SubscriptionResponse) {
    if (!this.subscribeNames.includes(resp.subscription)) return;
    this.spawnHandle({
      sign: this.sign,
      script: this.script,
      packageCwd: this.packageCwd,
      relativePath: this.relativePath,
      env: this.env,
    });
  }
}

type DirWatchStateProps = {
  sign: string;
  script: string;
  packageCwd: string;
  relativePath: string;
  env?: NodeJS.ProcessEnv;

  spawnHandle: (params: SpawnHandleParam) => Promise<void>;
};
