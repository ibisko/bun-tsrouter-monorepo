import type { MaybePromise } from 'bun';

/** 延迟 */
export const sleep = (duration: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      return reject(signal.reason);
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal!.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, duration);
    signal?.addEventListener('abort', onAbort, { once: true });
  });

/** 看门狗 */
export class WatchDog {
  isStop: boolean = false;
  private timeout: NodeJS.Timeout | null = null;
  private duration: number;
  private callback: () => MaybePromise<void>;
  constructor(callback: () => void, duration: number) {
    this.duration = duration;
    this.callback = callback;
    this.feed();
  }
  /** 喂食，并触发callback */
  feed() {
    clearTimeout(this.timeout!);
    this.timeout = setTimeout(this.callback, this.duration);
  }
  kill() {
    clearTimeout(this.timeout!);
    this.timeout = null;
    this.isStop = true;
  }
}
