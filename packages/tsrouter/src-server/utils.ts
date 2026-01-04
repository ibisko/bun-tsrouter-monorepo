import { kebabCase } from 'lodash-es';
import z from 'zod';
import type { Context, Middleware, RS } from './type';
import { MiddlewareError, ServiceError, ValidationError } from './error';
import { Logger } from './logger';

export const getPath = (path: string | string[]) => {
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

export const parseZodSchema = async (request: Bun.BunRequest, zodSchema: z.ZodObject) => {
  let param;
  if (request.method.toUpperCase() === 'GET') {
    const url = new URL(request.url);
    param = url.searchParams.toJSON();
  } else {
    param = await request.json();
  }
  console.log('param:', param);

  const resparse = z.safeParse(zodSchema, param);
  if (resparse.error) {
    throw new ValidationError(z.prettifyError(resparse.error));
  }
  return resparse.data as z.output<typeof zodSchema>;
};

// todo 只传 service.name
export const trycatchAndMiddlewaresHandle = (method: string, service: Function, callback: Middleware): RS => {
  return (logger, middlewares) => {
    logger = logger.child({ func: service.name });
    return {
      [method.toUpperCase()]: async (request: Bun.BunRequest, server: Bun.Server<undefined>) => {
        // const ctx = getContext(request, server, logger);

        // todo 如何指定reqId
        // todo request.$customData
        const reqId = `req-${Logger.reqId}`;
        console.log('reqId:', reqId);

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
          // todo 如何在中间件设置 Headers
          for (const mid of middlewares) {
            await mid(request, server, ctx);
          }
          // todo 这里await很重要，需要最小程度复现一下
          return await callback(request, server, ctx);
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
