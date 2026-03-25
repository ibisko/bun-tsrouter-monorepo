import watchman from 'fb-watchman';
import EventEmitter from 'events';

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

export type WatchProjectParam = {
  packageCwd: string;
  watch: string;
  script: string;
  suffixs?: string[];
};

export type SpawnHandleParam = {
  sign: string;
  script: string;
  packageCwd: string;
  relativePath?: string;
};

export type DirWatchState = {
  throttleTimeout: NodeJS.Timeout | null;
  event: EventEmitter;
  callback: (resp: watchman.SubscriptionResponse) => void;
};

export type WatchmanConfigInfo = Step[];
