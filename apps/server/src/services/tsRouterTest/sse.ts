import z from 'zod';
import { SseService } from '@packages/tsrouter/server';
import { sleep } from '@packages/utils';

export const sse1Schema = z.object({
  id: z.coerce.number(),
  name: z.string(),
});

export const sse1: SseService<typeof sse1Schema> = async (param, { write, signal }) => {
  for (let i = 0; i < 5; i++) {
    await sleep(1e3);
    signal.throwIfAborted();
    // console.log({ pid: process.pid }, `i>: ${i}-eee id:${param.id}, name:${param.name}`);
    await write(`i>: ${i}-eee id:${param.id}, name:${param.name}`);
  }
};

// 测试异常
export const sse2: SseService = async ({ write, signal }) => {
  for (let i = 0; i < 5; i++) {
    await sleep(1e3);
    signal.throwIfAborted();
    await write(`i>: ${i}-eee Empty`);
    // throw new Error('就开了大数据开发收到');
  }
};

// 返回步骤执行
export const sse3: SseService<typeof sse1Schema> = async (param, { write, signal }) => {
  let count = 0;
  return {
    running: async () => {
      for (let i = 0; i < 5; i++) {
        console.log('sse3 running');
        await sleep(1e3);
        signal.throwIfAborted();
        await write(`count: ${count} id: ${param.id} name: ${param.name}`);
        count++;
      }
    },
    finish: () => {
      console.log('finish count:', count);
    },
    disconnect: () => {
      console.log('disconnect count:', count);
    },
  };
};
