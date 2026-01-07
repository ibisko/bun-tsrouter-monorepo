import z from 'zod';
import { procedure } from '@packages/tsrouter/server';
import { sleep } from '@packages/utils';

export const sse1Schema = z.object({
  id: z.coerce.number(),
  name: z.string(),
});

export const sse1 = procedure.sse(sse1Schema, async (param, { write, signal }) => {
  for (let i = 0; i < 5; i++) {
    // console.log({ pid: process.pid }, `i>: ${i}-eee id:${param.id}, name:${param.name}`);
    await write(`i>: ${i}-eee id:${param.id}, name:${param.name}`, 'error');
    await sleep(1e3);
    signal.throwIfAborted();
  }
});

// 测试异常
export const sse2 = procedure.sse(async ({ write, signal }) => {
  for (let i = 0; i < 5; i++) {
    await write(`i>: ${i}-eee Empty`);
    await sleep(1e3);
    signal.throwIfAborted();
    // throw new Error('就开了大数据开发收到');
  }
});

// 返回步骤执行
export const sse3 = procedure.sse(sse1Schema, async (param, { write, signal }) => {
  let count = 0;
  for (let i = 0; i < 5; i++) {
    console.log('sse3 running');
    await write(`count: ${count} id: ${param.id} name: ${param.name}`);
    count++;
    await sleep(1e3);
    signal.throwIfAborted();
  }
});
