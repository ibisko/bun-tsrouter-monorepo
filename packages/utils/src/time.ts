/** 延迟 */
export const sleep = (duration: number) => new Promise<void>(r => setTimeout(r, duration));

/**
 * 看门狗
 * ```
 * const feed = watchdog(()=>{
 *   // 如果超过 1e3*5 时间没有喂食，就会触发
 * }, 1e3*5)
 *
 * feed() // 喂食，等待超时触发回调
 *
 * feed(false) // 结束，不再触发回调
 * ```
 * @returns 喂狗
 */
export const watchdog = (callback: () => void, duration: number) => {
  let timeout: NodeJS.Timeout | undefined;
  const fead: WatchdogFeed = (stop = false) => {
    clearTimeout(timeout);
    if (!stop) {
      timeout = setTimeout(callback, duration);
    }
  };
  fead();
  return fead;
};

type WatchdogFeed = {
  /** 喂食，等待超时触发回调 */
  (): void;
  /**
   * 喂狗
   * ```
   * feed(false) // 结束，不再触发回调
   * ```
   */
  (stop: true): void;
};
