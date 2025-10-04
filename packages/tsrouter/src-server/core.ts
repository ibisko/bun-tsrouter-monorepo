import { watchdog } from '@packages/utils';
import z, { ZodObject } from 'zod';
import type { FastifyInstance } from 'fastify';
import { Method, WriteFunc } from './type';
import { kebabCase } from 'lodash-es';

declare module 'fastify' {
  interface FastifyRequest {
    customData: {};
  }
}

type RestApiBaseParam = {
  path: string | string[];
  zodSchema?: ZodObject;
  service: (param: any, optional?: any) => Promise<any>;
};

export class RouterServer {
  fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  #getPath = (path: string | string[]) => {
    if (typeof path === 'string') {
      return path;
    }
    return (
      '/' +
      path
        .map(item => {
          if (item.startsWith(':')) {
            return item;
          }
          return kebabCase(item);
        })
        .join('/')
    );
  };

  parseZodSchema<T extends ZodObject>(zodSchema: T, param: unknown) {
    const resparse = z.safeParse(zodSchema, param);
    if (resparse.error) {
      throw resparse.error;
    }
    return resparse.data as z.output<T>;
  }

  #restApi({
    method,
    path,
    zodSchema,
    service,
  }: RestApiBaseParam & {
    method: Exclude<Method, 'sse'>;
  }) {
    const url = this.#getPath(path);
    this.fastify[method](url, async (request, reply) => {
      let response;
      if (zodSchema) {
        console.log('request.body:', request.body);
        const param = this.parseZodSchema(zodSchema, method === 'get' ? request.query : request.body);
        response = await service(param, request.customData);
      } else {
        response = await service(request.customData);
      }
      reply.send(response);
    });
  }

  get = (param: RestApiBaseParam) => this.#restApi({ method: 'get', ...param });
  post = (param: RestApiBaseParam) => this.#restApi({ method: 'post', ...param });
  patch = (param: RestApiBaseParam) => this.#restApi({ method: 'patch', ...param });
  put = (param: RestApiBaseParam) => this.#restApi({ method: 'put', ...param });
  delete = (param: RestApiBaseParam) => this.#restApi({ method: 'delete', ...param });

  sse({
    path,
    zodSchema,
    service,
  }: {
    path: string | string[];
    zodSchema?: ZodObject;
    service: any;
    // service: {
    //   (param: any, write: WriteFunc, optional: any): Promise<any>;
    //   (write: WriteFunc, optional: any): Promise<any>;
    // };
  }) {
    const url = this.#getPath(path);
    this.fastify.get(url, async (request, reply) => {
      let param = null;
      if (zodSchema) {
        param = this.parseZodSchema(zodSchema, request.query);
      }
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

        const callback: WriteFunc = (data, event?: string) => {
          fead();
          const msg = [`id: ${id}`, `data: ${data}`];
          if (event) {
            msg.push(`event: ${event}`);
          }
          reply.raw.write(msg.join('\n') + '\n\n');
          id++;
        };
        let response;
        if (param) {
          response = service(param, callback, request.customData);
        } else {
          response = service(callback, request.customData);
        }
        response.then(resolve).catch(resolve);
      });

      fead(true);
      reply.raw.end();
    });
  }
}
