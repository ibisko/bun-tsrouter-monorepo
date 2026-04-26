import { createStandardMethod } from './core/restApi';
import { Logger } from './logger';
import { BunServeHandler, Middleware } from './type';
import { createSseMethod } from './core/sse';
import { createUploadFile } from './core/uploadFile';
import { MaybePromise } from 'bun';
import { kebabCase } from 'lodash-es';

export const procedure = {
  // 基础方法
  get: createStandardMethod('get'),
  post: createStandardMethod('post'),
  patch: createStandardMethod('patch'),
  put: createStandardMethod('put'),
  delete: createStandardMethod('delete'),
  // 扩展方法
  sse: createSseMethod(),
  uploadFile: createUploadFile(),
};

type CreateRouterParams = {
  prefix?: `/${string}`;
  router: Record<string, unknown>;
  logger: Logger;
  middlewares: Middleware[];
  optionsService?: BunServeHandler;
};

export const createRouter = ({ prefix = '/', router, logger, middlewares, optionsService }: CreateRouterParams) => {
  if (prefix.length > 1 && prefix.endsWith('/')) {
    prefix = prefix.slice(0, -1) as `/${string}`;
  }

  const routes: Record<string, () => MaybePromise<Response>> = {};

  const parseRouter = (router: any, prefix: string) => {
    for (const [key, func] of Object.entries(router)) {
      const regexp = /^\$(.*)/.exec(key);
      const _prefix = `${prefix}/${regexp ? `:${kebabCase(regexp[1])}` : kebabCase(key)}`;
      if (typeof func === 'function') {
        routes[_prefix] = func(logger, middlewares, optionsService);
      } else {
        parseRouter(func, _prefix);
      }
    }
  };
  parseRouter(router, prefix);

  return routes;
};
