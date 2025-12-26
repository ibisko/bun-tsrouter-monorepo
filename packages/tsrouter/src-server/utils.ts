import { FastifyBaseLogger, FastifyRequest } from 'fastify';
import { kebabCase, merge } from 'lodash-es';
import z, { ZodObject } from 'zod';
import type { Context } from './type';
import { ValidationError } from './error';

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

export const parseZodSchema = <T extends ZodObject>(zodSchema: T, param: unknown): z.output<T> => {
  const resparse = z.safeParse(zodSchema, param);
  if (resparse.error) {
    throw new ValidationError(resparse.error);
  }
  return resparse.data as z.output<T>;
};

export const getContext = (request: FastifyRequest, logger: FastifyBaseLogger) => {
  const optional = {
    url: request.url,
    params: request.params as Record<string, string>,
    ip: request.ip,
    query: request.query as Record<string, string>,
    body: request.body,
  };
  const ctx: Context = {
    ...optional,
    headers: request.headers as Record<string, string>,
    logger: logger.child({
      reqId: request.id,
      ...optional,
    }),
  };
  return merge(request.$customData, ctx);
};
