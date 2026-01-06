import { kebabCase } from 'lodash-es';
import z from 'zod';
import type { Context, Middleware, RS } from './type';
import { MiddlewareError, ServiceError, ValidationError } from './error';
import { Logger } from './logger';

export const getPath = (path: string | string[]) => {
  if (typeof path === 'string') return path;
  return '/' + path.map(item => (item.startsWith(':') ? item : kebabCase(item))).join('/');
};

export const parseZodSchema = async (request: Bun.BunRequest, zodSchema: z.ZodObject) => {
  let param;
  if (request.method.toUpperCase() === 'GET') {
    const url = new URL(request.url);
    param = url.searchParams.toJSON();
  } else {
    param = await request.json();
  }

  const resparse = z.safeParse(zodSchema, param);
  if (resparse.error) {
    throw new ValidationError(z.prettifyError(resparse.error));
  }
  return resparse.data as z.output<typeof zodSchema>;
};

export const trycatchAndMiddlewaresHandle = (method: string, serviceFuncName: string, callback: Middleware): RS => {
  return (logger, middlewares) => {
    logger = logger.child({ func: serviceFuncName });
    return {
      [method.toUpperCase()]: async (request: Bun.BunRequest, server: Bun.Server<undefined>) => {
        const reqId = `req-${Logger.reqId}`;

        Logger.reqId++;
        logger = logger.child({
          reqId,
          req: {
            method: request.method.toUpperCase(),
            url: request.url,
            ip: server.requestIP(request),
          },
        });
        logger.info();

        const ctx: Context = {
          url: request.url,
          params: request.params,
          ip: server.requestIP(request),
          headers: request.headers,
          resHeaders: new Headers(),
          body: request.body,
          logger,
        };

        try {
          for (const mid of middlewares) {
            await mid(request, ctx);
          }
          ctx.logger = ctx.logger.child({ step: 'service' });
          // todo 这里await很重要，需要最小程度复现一下
          return await callback(request, ctx);
        } catch (error) {
          if (error instanceof MiddlewareError) {
            ctx.logger.error({
              step: 'middleware',
              func: error.func,
              msg: error.message,
              reason: error.reason,
              data: error.data,
            });
            return new Response(error.message, { status: error.status });
          } else if (error instanceof ValidationError) {
            ctx.logger.error({
              step: 'validation',
              msg: error.message,
            });
            return new Response(error.message, { status: 400 });
          } else if (error instanceof ServiceError) {
            ctx.logger.error({
              step: 'service',
              msg: error.message,
              reason: error.reason,
              data: error.data,
            });
            return new Response(error.message, { status: error.status });
          } else if (error instanceof Error) {
            ctx.logger.error({
              step: 'serviceAccident',
              msg: error.message,
              data: { stack: error.stack },
            });
            return new Response(error.message, { status: 500 });
          } else {
            ctx.logger.error({
              step: 'serviceAccident',
              msg: '未知异常',
              data: { error },
            });
            return new Response('未知异常', { status: 500 });
          }
        }
      },
      // todo 外部设置？
      OPTIONS: () => {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With, X-Cos-Meta');
        return new Response(null, {
          status: 204,
          headers,
        });
      },
    };
  };
};

export function parseToFastJsonStringify(obj: Record<string, any>) {
  const res: Record<string, any> = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      res[key] = { type: obj[key] };
    } else if (typeof obj[key] === 'object') {
      res[key] = {
        type: 'object',
        properties: parseToFastJsonStringify(obj[key]),
      };
    }
  }
  return res;
}
