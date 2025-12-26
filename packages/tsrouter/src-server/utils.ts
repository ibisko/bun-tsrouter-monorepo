import { FastifyRequest } from 'fastify';
import { kebabCase } from 'lodash-es';
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

export const getContext = (request: FastifyRequest) => {
  return Object.assign(request.$customData ?? {}, {
    reqId: request.id,
    url: request.url,
    params: request.params,
    headers: request.headers,
    ip: request.ip,
    query: request.query,
    body: request.body,
  }) as Context;
};
