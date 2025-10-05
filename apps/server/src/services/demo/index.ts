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

export const demosseService = async (param: z.output<typeof zodDemoSSEService>, write: (data: any) => void) => {
  for (let i = 0; i < 5; i++) {
    await sleep(1e3);
    write(`i>: ${i}eee`);
  }
};

export const demosseServiceEmp = async (write: (data: any) => void) => {
  for (let i = 0; i < 5; i++) {
    await sleep(1e3);
    write(`i>: ${i}eee`);
  }
};
