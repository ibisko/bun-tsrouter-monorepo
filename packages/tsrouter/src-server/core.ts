import { sleep, watchdog } from '@packages/utils';
import { ZodObject } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { Method, RestApiBaseParam, RouterServerOptions, WriteFunc } from './type';
import { getContext, getPath, parseZodSchema } from './utils';
import { ServiceError } from './error';

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
      // 参数校验
      let param = null;
      if (zodSchema) {
        param = parseZodSchema(zodSchema, method === 'get' ? request.query : request.body);
      }
      // 设置日志实例，绑定到 ctx
      const ctx = getContext(request);
      ctx.logger = this.formatLogger ? logger.child(this.formatLogger(request, reply)) : logger;

      // 执行 service 捕获异常
      try {
        const response = await (param ? service(param, ctx) : service(ctx));
        reply.send(response);
      } catch (error) {
        if (error instanceof ServiceError) {
          ctx.logger.error(error.format());
          throw error;
        }
        const reason = error instanceof Error ? error.message : error;
        const serviceError = new ServiceError({ message: '意外异常', reason, isAccident: true });
        ctx.logger.error(serviceError.format());
        throw serviceError;
      }
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
      // 参数校验
      let param = null;
      if (zodSchema) {
        param = parseZodSchema(zodSchema, request.query);
      }
      // 在ctx设置日志实例
      const ctx = getContext(request);
      ctx.logger = this.formatLogger ? logger.child(this.formatLogger(request, reply)) : logger;

      reply.raw.setHeader('access-control-allow-origin', '*');
      reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      reply.raw.setHeader('Connection', 'keep-alive');
      reply.raw.setHeader('Cache-Control', 'no-cache,no-transform');
      reply.raw.setHeader('x-no-compression', 1);

      const fead = watchdog(() => {
        reply.raw.write(':\n\n');
        fead();
      }, 1e3 * 15); // 15s 一次发送心跳

      await new Promise(async resolve => {
        request.raw.on('close', () => {
          if (fead.isStop) return;
          resolve(null);
        });

        let id = 0;
        // client 中断时候
        const callback: WriteFunc = async (data, event?: string) => {
          if (fead.isStop) throw new ServiceError({ message: 'client close' });
          fead();
          const msg = [`id: ${id}`, `data: ${data}`];
          if (event) {
            msg.push(`event: ${event}`);
          }
          reply.raw.write(msg.join('\n') + '\n\n');
          id++;
        };

        try {
          await (param ? service(param, callback, ctx) : service(callback, ctx));
          resolve(null);
        } catch (error) {
          // 日志记录
          let errorInfo;
          if (error instanceof ServiceError) {
            errorInfo = error.format();
          } else {
            const reason = error instanceof Error ? error.message : error;
            errorInfo = { message: '意外异常', reason };
          }
          ctx.logger.error(errorInfo);
          await callback(errorInfo.message, 'error');
          resolve(null);
        }
      });

      fead(true);
      reply.raw.write;
      await sleep(1e3);
      reply.raw.end();
    });
  }
}
