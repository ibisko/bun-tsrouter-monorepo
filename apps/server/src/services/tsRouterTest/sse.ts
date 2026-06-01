import z from 'zod';
import { procedure } from '@packages/tsrouter/server';
import { sleep } from '@packages/utils';

export const sse1Schema = z.object({
  startCount: z.coerce.number(),
  name: z.string(),
});

export const sse1 = procedure.sse(sse1Schema, async ({ startCount, name }, { write }) => {
  for (let i = 0; i < 5; i++) {
    await write({ startCount, name });
    startCount++;
  }
});

export const sse2 = procedure.sse(async ({ write }) => {
  for (let i = 0; i < 5; i++) {
    if (i >= 1) throw new Error('期望异常');
    await write(`i>: ${i}-eee Empty`);
    await sleep(1e3);
  }
});
