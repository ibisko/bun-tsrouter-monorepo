type RetryHandleOptions = {
  maxTryCount?: number;
  delay?: number;
};
/**
 * 异步调用，失败就自动重试
 * 默认重试 3 次，每次间隔 3s
 * ```ts
 * // 使用例子
 * await retryHandle(() => this.#getCredential())
 *
 * // 注意别这样写
 * await retryHandle(this.#getCredential) // this 会丢失
 * ```
 */
export const retryHandle = <T>(fn: (abort: () => void) => Promise<T> | T, options?: RetryHandleOptions) => {
  const maxTryCount = options?.maxTryCount ?? 3;
  const delay = options?.delay ?? 1e3;
  let tryCount = 1;
  async function handle() {
    try {
      let isAbort = false;
      const res = await fn(() => {
        isAbort = true;
      });
      if (isAbort) {
        throw new AbortError();
      }
      return res;
    } catch (error) {
      if (error instanceof AbortError) {
        throw error;
      }
      if (tryCount < maxTryCount) {
        tryCount++;
        await new Promise(r => setTimeout(r, delay));
        return handle();
      }
      throw error;
    }
  }
  return handle();
};

class AbortError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}
