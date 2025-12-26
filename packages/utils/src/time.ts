import type { MaybePromise } from 'bun';

/** 延迟 */
export const sleep = (duration: number) => new Promise<void>(r => setTimeout(r, duration));

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
    this.timeout = setTimeout(this.callback, this.duration);
  }
  kill() {
    clearTimeout(this.timeout!);
    this.timeout = null;
    this.isStop = true;
  }
}
