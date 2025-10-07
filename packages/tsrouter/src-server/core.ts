import { watchdog } from '@packages/utils';
import { ZodObject } from 'zod';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { Method, RestApiBaseParam, RouterServerOptions, WriteFunc } from './type';
import { getContext, getPath, parseZodSchema } from './utils';

declare module 'fastify' {
  interface FastifyRequest {
    $customData?: {};
  }
}

export class RouterServer {
  fastify: FastifyInstance;
  formatLogger: RouterServerOptions['formatLogger'];
  constructor(fastify: FastifyInstance, options?: RouterServerOptions) {
    this.fastify = fastify;
    this.formatLogger = options?.formatLogger;
  }

  #restApi({
    method,
    path,
    zodSchema,
    service,
  }: RestApiBaseParam & {
    method: Exclude<Method, 'sse'>;
  }) {
    const url = getPath(path);
    const logger = this.fastify.log.child({ method: service.name });
    this.fastify[method](url, async (request, reply) => {
      const ctx = getContext(request);
      let response;

      // 可以在ctx设置日志实例
      if (this.formatLogger) {
        ctx.logger = logger.child(this.formatLogger(request, reply));
      } else {
        ctx.logger = logger;
      }

      if (zodSchema) {
        console.log('request.body:', request.body);
        const param = parseZodSchema(zodSchema, method === 'get' ? request.query : request.body);
        response = await service(param, ctx);
      } else {
        response = await service(ctx);
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
    service: {
      (param: any, write: WriteFunc, optional?: any): Promise<any>;
      (write: WriteFunc, optional?: any): Promise<any>;
    };
  }) {
    const url = getPath(path);
    const logger = this.fastify.log.child({ method: service.name });
    this.fastify.get(url, async (request, reply) => {
      let param = null;
      if (zodSchema) {
        param = parseZodSchema(zodSchema, request.query);
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

        const ctx = getContext(request);
        ctx.logger = logger;
        let response;
        if (param) {
          response = service(param, callback, ctx);
        } else {
          response = service(callback, ctx);
        }
        response.then(resolve).catch(resolve);
      });

      fead(true);
      reply.raw.end();
    });
  }
}
