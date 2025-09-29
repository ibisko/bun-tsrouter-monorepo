import { watchdog } from '@packages/utils';
import z, { ZodObject } from 'zod';
import type { FastifyInstance } from 'fastify';
import { WriteFunc } from './type';

export class RouterServer {
  fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  #getPath = (path: string | string[]) => {
    if (typeof path === 'string') {
      return path;
    }
    return '/' + path.join('/');
  };

  parseZodSchema<T extends ZodObject>(zodSchema: T, param: unknown) {
    const resparse = z.safeParse(zodSchema, param);
    if (resparse.error) {
      throw resparse.error;
    }
    return resparse.data as z.output<T>;
  }

  get<T extends ZodObject, R>(path: string | string[], zodSchema: T, service: (param: z.output<T>) => Promise<R>) {
    const url = this.#getPath(path);
    this.fastify.get(url, async (request, reply) => {
      console.log('request.params:', request.params);
      // todo 需要将 request.params 传入到 service 第二参数中
      const param = this.parseZodSchema(zodSchema, request.query);
      // todo 第二参数
      const response = await service(param);
      reply.send(response);
    });
  }

  post<T extends ZodObject, R>(path: string | string[], zodSchema: T, service: (param: z.output<T>) => Promise<R>) {
    const url = this.#getPath(path);
    this.fastify.post(url, async (request, reply) => {
      const param = this.parseZodSchema(zodSchema, request.body);
      // todo 第二参数
      const response = await service(param);
      reply.send(response);
    });
  }

  sse<T extends ZodObject, R>(
    path: string | string[],
    zodSchema: T,
    service: (param: z.output<T>, write: WriteFunc) => Promise<R>,
  ) {
    const url = this.#getPath(path);
    console.log('sse url:', url);
    this.fastify.get(url, async (request, reply) => {
      const param = this.parseZodSchema(zodSchema, request.query);
      reply.raw.setHeader('access-control-allow-origin', '*');
      reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      reply.raw.setHeader('Connection', 'keep-alive');
      reply.raw.setHeader('Cache-Control', 'no-cache,no-transform');
      reply.raw.setHeader('x-no-compression', 1);

      const fead = watchdog(() => {
        reply.raw.write(':\n\n');
        fead();
      }, 1e3 * 15); // 15s 一次发送心跳

      // todo 第二参数
      await new Promise(resolve => {
        request.raw.on('close', () => {
          resolve(null);
        });

        let id = 0;
        service(param, (data, event?: string) => {
          fead();
          const msg = [`id: ${id}`, `data: ${data}`];
          if (event) {
            msg.push(`event: ${event}`);
          }
          reply.raw.write(msg.join('\n') + '\n\n');
          id++;
        })
          // .then(resolve)
          .then(r => {
            resolve(r);
          })
          .catch(resolve);
      });

      fead(true);
      reply.raw.end();
    });
  }
}
