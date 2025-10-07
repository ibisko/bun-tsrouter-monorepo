import { FastifyRequest } from 'fastify';
import { kebabCase } from 'lodash-es';
import z, { ZodObject } from 'zod';
import type { Context } from './type';

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

export const parseZodSchema = <T extends ZodObject>(zodSchema: T, param: unknown) => {
  const resparse = z.safeParse(zodSchema, param);
  if (resparse.error) {
    throw resparse.error;
  }
  return resparse.data as z.output<T>;
};

export const getContext = (request: FastifyRequest) => {
  return Object.assign(request.$customData ?? {}, {
    query: request.query,
    url: request.url,
    ip: request.ip,
    params: request.params,
  }) as Context;
};
