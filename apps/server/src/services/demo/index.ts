import { SseService } from '@packages/tsrouter/server';
import { sleep } from '@packages/utils';
import z from 'zod';

export const zodDemoSchema = z.object({
  id: z.coerce.number({ error: '没有id' }),
  text: z.string({ error: '没有text' }),
});

export const demoService = async (param: z.output<typeof zodDemoSchema>) => {
  // throw new Error('测试');
  await sleep(1e3 * 2);
  return { id: param.id, text: param.text, msg: 'demoservice' };
};
export const demoServiceEmp = async () => {
  return { id: 1, text: 'empty', msg: 'demoserviceEmp!' };
};

export const zodDemoSSEService = z.object({
  jfklsd: z.coerce.number(),
  KJKFD: z.string(),
});

export const demosseService: SseService<typeof zodDemoSSEService> = async (param, { write, signal }) => {
  for (let i = 0; i < 5; i++) {
    await sleep(1e3);
    signal.throwIfAborted();
    write(`i>: ${i}eee`);
  }
  return {
    running() {},
  };
};

export const demosseServiceEmp: SseService = async ({ write, signal }) => {
  for (let i = 0; i < 5; i++) {
    await sleep(1e3);
    signal.throwIfAborted();
    write(`i>: ${i}eee`);
  }
};
