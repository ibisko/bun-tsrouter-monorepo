import z, { ZodObject } from 'zod';
import { RouterServer } from './core';
import { RegisterableProcedure, RestApiMethod, RouterServerOptions, WriteFunc } from './type';
import { FastifyInstance } from 'fastify';
import { UploadMultipartCallback } from './multipart';

const createStandardMethod =
  <M extends RestApiMethod>(method: M) =>
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
    const func: RegisterableProcedure<M, T, R> = (rs, path) => rs[method]({ path, zodSchema: _zodSchema, service: _service });
    func.Method = method;
    return func;
  };

const createSseMethod = <T extends ZodObject | Function = any, R = any>(
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
  const func: RegisterableProcedure<'sse', T, R> = (rs, path) => rs.sse({ path, zodSchema: _zodSchema, service: _service });
  func.Method = 'sse';
  return func;
};

const createUploadFile = (service: UploadMultipartCallback) => {
  const func: RegisterableProcedure<'uploadFile'> = (rs, path) => rs.uploadFile(path, service);
  func.Method = 'uploadFile';
  return func;
};

export const procedure = {
  get: createStandardMethod('get'),
  post: createStandardMethod('post'),
  patch: createStandardMethod('patch'),
  put: createStandardMethod('put'),
  delete: createStandardMethod('delete'),
  sse: createSseMethod,
  uploadFile: createUploadFile,
};

// todo 改为对象参数，便于定义扩展
export const createRouter = (fastify: FastifyInstance, routerTree: any, options?: RouterServerOptions) => {
  const rs = new RouterServer(fastify, options);

  const parseRouter = (router: any, prefix: string[] = []) => {
    for (const [key, value] of Object.entries(router)) {
      const regexp = /^\$(.*)/.exec(key);
      const _prefix = regexp ? prefix.concat(':' + regexp[1]) : prefix.concat(key);
      if (typeof value === 'function') {
        const func = value as RegisterableProcedure;
        if (['get', 'post', 'patch', 'put', 'delete', 'sse', 'uploadFile'].includes(func.Method!)) {
          func(rs, _prefix);
          continue;
        }
      }
      parseRouter(value, _prefix);
    }
  };
  parseRouter(routerTree);
};
