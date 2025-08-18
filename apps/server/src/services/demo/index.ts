import z from 'zod';

export const zodDemoSchema = z.object({
  id: z.number({ error: '没有id' }),
  text: z.string({ error: '没有text' }),
});

export const demoService = async (param: z.output<typeof zodDemoSchema>) => {
  // throw new Error('测试');
  return { id: param.id, text: param.text, msg: 'demoservice' };
};
