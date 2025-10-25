import { sleep } from '@packages/utils';
import z from 'zod';

export const sse1Schema = z.object({
  id: z.coerce.number(),
  name: z.string(),
});

export const sse1 = async (param: z.output<typeof sse1Schema>, write: (data: any) => Promise<void>) => {
  for (let i = 0; i < 5; i++) {
    await sleep(1e3);
    // console.log({ pid: process.pid }, `i>: ${i}-eee id:${param.id}, name:${param.name}`);
    await write(`i>: ${i}-eee id:${param.id}, name:${param.name}`);
  }
};

export const sse2 = async (write: (data: any) => Promise<void>) => {
  for (let i = 0; i < 5; i++) {
    await sleep(1e3*5);
    // console.log({ pid: process.pid }, `i>: ${i}-eee Empty`);
    await write(`i>: ${i}-eee Empty`);
    throw new Error("就开了大数据开发收到")
  }
};
