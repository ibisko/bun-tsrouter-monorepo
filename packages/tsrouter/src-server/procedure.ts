import z, { ZodObject } from 'zod';
import { RouterServer } from './core';
import { RegisterableProcedure, WriteFunc } from './type';
import { FastifyInstance } from 'fastify';

const createStandardMethod =
  <M extends 'get' | 'post'>(method: M) =>
  <T extends ZodObject = any, R = any>(zodSchema: T, service: (param: z.output<T>) => Promise<R>) => {
    const func: RegisterableProcedure<M, T, R> = (rs, path) => rs[method](path, zodSchema, service);
    func.Method = method;
    return func;
  };

const createSseMethod =
  <M extends 'sse'>(method: M) =>
  <T extends ZodObject = any, R = any>(zodSchema: T, service: (param: z.output<T>, write: WriteFunc) => Promise<R>) => {
    const func: RegisterableProcedure<M, T, R> = (rs, path) => rs[method](path, zodSchema, service);
    func.Method = method;
    return func;
  };

export const procedure = {
  get: createStandardMethod('get'),
  post: createStandardMethod('post'),
  sse: createSseMethod('sse'),
};

export const createRouter = (fastify: FastifyInstance, routerTree: any) => {
  const rs = new RouterServer(fastify);

  const parseRouter = (router: any, prefix: string[] = []) => {
    for (const [key, value] of Object.entries(router)) {
      const regexp = /^\$(.*)/.exec(key);
      const _prefix = regexp ? prefix.concat(':' + regexp[1]) : prefix.concat(key);
      if (typeof value === 'function') {
        const func = value as RegisterableProcedure;
        switch (func.Method) {
          case 'get':
            return func(rs, _prefix);
          case 'post':
            return func(rs, _prefix);
          case 'sse':
            return func(rs, _prefix);
          default:
            return;
        }
      }
      parseRouter(value, _prefix);
    }
  };
  parseRouter(routerTree);
};
