import z from 'zod';
import { Context, ServiceError } from '@packages/tsrouter/server';

export const get1 = () => {
  return { msg: 'Get(1) not params' };
};

export const get2Schema = z.object({
  id: z.coerce.number(),
  name: z.string(),
});

export const get2 = async (param: z.output<typeof get2Schema>, { logger }: Context) => {
  logger.error({ msg: 'Error日志记录!', data: { id: 12, name: 'duoduo' } });
  throw new ServiceError({ message: 'Test-Service-Error!' });
  return param;
};
