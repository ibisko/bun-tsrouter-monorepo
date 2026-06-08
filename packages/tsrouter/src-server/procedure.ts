import { createDownloadMethod, createStandardMethod } from './core/restApi';
import { Logger } from './logger';
import { BunServeHandler, Middleware } from './type';
import { createSseMethod } from './core/sse';
import { createPostFormData } from './core/postFormData';
import { MaybePromise } from 'bun';
import { kebabCase } from 'lodash-es';
import { createPutFile, createPutFileXhr } from './core/putFile';

export const procedure = {
  // 基础 RestApi
  get: createStandardMethod('get'),
  post: createStandardMethod('post'),
  patch: createStandardMethod('patch'),
  put: createStandardMethod('put'),
  delete: createStandardMethod('delete'),
  // 扩展 Method
  sse: createSseMethod(),
  postFormData: createPostFormData(),
  putFile: createPutFile(),
  putFileXhr: createPutFileXhr(),
  download: createDownloadMethod(), // 本质还是原来的 get
};

type CreateRouterParam = {
  prefix?: `/${string}`;
  router: Record<string, unknown>;
  logger: Logger;
  middlewares: Middleware[];
  optionsService?: BunServeHandler;
};

export const createRouter = ({ prefix = '/', router, logger, middlewares, optionsService }: CreateRouterParam) => {
  if (prefix.length > 1 && prefix.endsWith('/')) {
    prefix = prefix.slice(0, -1) as `/${string}`;
  }

  const routes: Record<string, () => MaybePromise<Response>> = {};

  const parseRouter = (router: any, prefix: string) => {
    for (const [key, func] of Object.entries(router)) {
      const regexp = /^\$(.*)/.exec(key);
      const _prefix = `${prefix}/${regexp ? `:${kebabCase(regexp[1])}` : kebabCase(key)}`;
      if (typeof func === 'function') {
        // 此处定义 Bun.serve routes 的路径路由
        routes[_prefix] = func(logger, middlewares, optionsService);
      } else {
        parseRouter(func, _prefix);
      }
    }
  };
  parseRouter(router, prefix);

  return routes;
};
