import z, { ZodObject } from 'zod';
import { RouterServer } from './core';
import { Method, RegisterableProcedure, WriteFunc } from './type';
import { FastifyInstance } from 'fastify';

const createStandardMethod =
  <M extends Method>(method: M) =>
  <T extends ZodObject | Function = any, R = any>(
    zodSchema: T,
    ...service: T extends Function ? [] : [(param: z.output<T>, optional?: any) => Promise<R>]
  ) => {
    let _zodSchema = undefined;
    let _service;
    if (typeof zodSchema === 'function') {
      _service = zodSchema as (param: z.output<T>, optional?: any) => Promise<R>;
    } else {
      _zodSchema = zodSchema;
      _service = service[0]!;
    }
    const func: RegisterableProcedure<M, T, R> = (rs, path) =>
      rs[method]({ path, zodSchema: _zodSchema, service: _service });
    func.Method = method;
    return func;
  };

const createSseMethod =
  <M extends 'sse'>(method: M) =>
  <T extends ZodObject | Function = any, R = any>(
    zodSchema: T,
    ...service: T extends Function ? [] : [(param: any, write: WriteFunc, optional?: any) => Promise<R>]
  ) => {
    let _zodSchema = undefined;
    let _service;
    if (typeof zodSchema === 'function') {
      _service = zodSchema as (write: WriteFunc, optional?: any) => Promise<R>;
    } else {
      _zodSchema = zodSchema;
      _service = service[0]!;
    }
    const func: RegisterableProcedure<M, T, R> = (rs, path) =>
      rs[method]({ path, zodSchema: _zodSchema, service: _service });
    func.Method = method;
    return func;
  };

export const procedure = {
  get: createStandardMethod('get'),
  post: createStandardMethod('post'),
  patch: createStandardMethod('patch'),
  put: createStandardMethod('put'),
  delete: createStandardMethod('delete'),
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
        if (['get', 'post', 'patch', 'put', 'delete', 'sse'].includes(func.Method!)) {
          func(rs, _prefix);
          continue;
        }
      }
      parseRouter(value, _prefix);
    }
  };
  parseRouter(routerTree);
};
