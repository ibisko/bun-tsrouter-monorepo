import { getPath } from './utils';
import { createStandardMethod } from './core/restApi';
import { Logger } from './logger';
import { Middleware } from './type';
import { createSseMethod } from './core/sse';
import { MaybePromise } from '@packages/utils/types';

export const procedure = {
  // 基础方法
  get: createStandardMethod('get'),
  post: createStandardMethod('post'),
  patch: createStandardMethod('patch'),
  put: createStandardMethod('put'),
  delete: createStandardMethod('delete'),
  // 扩展方法
  sse: createSseMethod(),
  // uploadFile: createUploadFile,
};

type CreateRouterParams = {
  router: Record<string, unknown>;
  logger: Logger;
  middlewares: Middleware[];
  prefix?: string[];
};
export const createRouter = ({ router, logger, middlewares, prefix }: CreateRouterParams) => {
  const routes: Record<string, () => MaybePromise<Response>> = {};
  const parseRouter = (router: any, prefix: string[] = []) => {
    for (const [key, func] of Object.entries(router)) {
      const regexp = /^\$(.*)/.exec(key);
      const _prefix = regexp ? prefix.concat(':' + regexp[1]) : prefix.concat(key);
      if (typeof func === 'function') {
        const url = getPath(_prefix);
        routes[url] = func(logger, middlewares);
        continue;
      }
      parseRouter(func, _prefix);
    }
  };
  parseRouter(router, prefix);
  return routes;
};
