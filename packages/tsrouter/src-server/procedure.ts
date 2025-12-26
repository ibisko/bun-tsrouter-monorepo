import z, { ZodObject } from 'zod';
import { RegisterableProcedure, RestApiMethod, RestApiService, RouterServerOptions, SseService } from './type';
import { FastifyInstance } from 'fastify';
import { UploadMultipartCallback } from './multipart';
import { RouterServer } from './core/RouterServer';

const createStandardMethod =
  <M extends RestApiMethod>(method: M) =>
  <T extends ZodObject | RestApiService = any, R = any>(...args: T extends ZodObject ? [T, RestApiService<T, R>] : [T]) => {
    let func: RegisterableProcedure<M, T, R>;
    if (typeof args[0] === 'function') {
      const service = args[0];
      func = (rs, path) => rs[method]({ path, zodSchema: undefined, service });
    } else {
      const zodSchema = args[0];
      func = (rs, path) => rs[method]({ path, zodSchema, service: args[1]! });
    }
    func.Method = method;
    return func;
  };

const createSseMethod = <T extends ZodObject | SseService = any, R = any>(...args: T extends ZodObject ? [T, SseService<T>] : [T]) => {
  let func: RegisterableProcedure<'sse', T, R>;
  if (typeof args[0] === 'function') {
    const service = args[0];
    func = (rs, path) => rs.sse({ path, zodSchema: undefined, service });
  } else {
    const zodSchema = args[0];
    func = (rs, path) => rs.sse({ path, zodSchema, service: args[1]! });
  }
  func.Method = 'sse';
  return func;
};

const createUploadFile = (service: UploadMultipartCallback) => {
  const func: RegisterableProcedure<'uploadFile'> = (rs, path) => rs.uploadFile(path, service);
  func.Method = 'uploadFile';
  return func;
};

export const procedure = {
  // 基础方法
  get: createStandardMethod('get'),
  post: createStandardMethod('post'),
  patch: createStandardMethod('patch'),
  put: createStandardMethod('put'),
  delete: createStandardMethod('delete'),
  // 扩展方法
  sse: createSseMethod,
  uploadFile: createUploadFile,
};

type CreateRouterParams = {
  fastify: FastifyInstance;
  router: any;
  options?: RouterServerOptions;
};
export const createRouter = ({ fastify, router, options }: CreateRouterParams) => {
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
  parseRouter(router);
};
