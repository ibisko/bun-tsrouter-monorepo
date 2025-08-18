import { FastifyReply, FastifyRequest } from 'fastify';
import z, { ZodError } from 'zod';

export const wrapperService = <T, R = any>(
  req: FastifyRequest,
  method: 'get' | 'post' | 'put' | 'delete',
  reply: FastifyReply,
  zodSchema: T,
  service: (param: z.output<T>) => R,
) =>
  // todo 对于 get query 参数都是字符串，怎么正确转换
  new Promise<z.output<typeof zodSchema>>(r => {
    const schema = zodSchema as z.ZodObject;
    const paramType = method === 'get' ? 'query' : 'body';
    const param: { [k: string]: string | number } = req[paramType] as {};
    if (paramType === 'query') {
      // Object.entries(schema.shape)
      Object.entries(param).map(([key, value]) => {
        if (schema.shape[key].def.type === 'number') {
          const num = +value;
          if (isNaN(num)) throw new Error(`${key} 为非数字`);
          param[key] = num;
        }
      });
    }
    const res = schema.parse(param) as z.output<typeof zodSchema>;
    r(res);
  })
    .then(param =>
      (service as any)(param)
        .then((res: unknown) => reply.send(res))
        .catch((error: { message: any }) => {
          if (error instanceof Error) {
            reply.status(400).send({ msg: error.message, data: null });
          } else {
            reply.status(400).send({ msg: 'error', data: error });
          }
        }),
    )
    .catch(error => {
      if (error instanceof ZodError) {
        return reply.status(400).send(z.prettifyError(error));
      }
    });

/* export const wrapperServices = (
  req: FastifyRequest,
  reply: FastifyReply,
  zodSchema: z.ZodObject,
  services: ((param: any) => Promise<unknown>)[],
) =>
  new Promise<z.output<typeof zodSchema>>(r => r(zodSchema.parse(req.body)))
    .then(async body => {
      let res: unknown = body;
      try {
        for (const service of services) {
          res = await service(res);
          // todo 或许需要再嵌入 user_id
        }
        reply.send(res);
      } catch (error) {
        if (error instanceof Error) {
          reply.status(400).send({ msg: error.message, data: null });
        } else {
          reply.status(400).send({ msg: 'error', data: error });
        }
      }
    })
    .catch(error => {
      if (error instanceof ZodError) {
        return reply.status(400).send(z.prettifyError(error));
      }
    }); */
