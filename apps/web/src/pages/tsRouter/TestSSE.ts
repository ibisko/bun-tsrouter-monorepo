import { Api } from '@/api';
import { ResponseError } from '@packages/tsrouter/client';

export const sseTest1 = async () => {
  let startCount = 0;
  const callback = await Api.test.tsRouter.sse1.sse({ startCount, name: 'nnhu' });
  await callback(({ data }) => {
    if (startCount !== data.startCount) {
      throw new Error('startCount 对不上');
    }
    startCount++;
  });
};

export const sseTest2 = async () => {
  const abortController = new AbortController();
  const cb = await Api.test.tsRouter.sse1.sse({ startCount: 0, name: 'nnhu' }, { signal: abortController.signal });
  abortController.abort();
  try {
    await cb(() => {});
  } catch {
    return;
  }
  throw new Error('期望 Abort 结束的');
};

export const sseTest3 = async () => {
  const callback = await Api.test.tsRouter.sse2.sse();
  try {
    await callback(() => {});
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.message !== '期望异常') throw new Error('没有获取到期望的错误消息');
    }
  }
};

export const sseTest4 = async () => {
  const abortController = new AbortController();
  const callback = await Api.test.tsRouter.sse2.sse(null, { signal: abortController.signal });
  try {
    await callback(() => {
      abortController.abort();
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return;
    throw new Error('未按预期捕获到抛出的异常');
  }
};
