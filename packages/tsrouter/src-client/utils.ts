import { kebabCase } from 'lodash-es';
import type { RestApiParams, TsRouterClass, TsRouterOptions } from './type';

interface ParseUrlParams extends Pick<RestApiParams, 'path' | 'query'>, Pick<TsRouterOptions, 'baseUrl' | 'prefix'> {}

export const parseUrl = ({ baseUrl, path, query, prefix }: ParseUrlParams) => {
  if (typeof path === 'string') {
    if (prefix) {
      path = path.startsWith('/') ? `${prefix}${path}` : `${prefix}/${path}`;
    }
  } else {
    if (prefix) {
      path = [prefix, ...path];
    }
    path = path.map(kebabCase).join('/');
  }
  const url = new URL(path, baseUrl);
  if (query) {
    Object.entries(query).map(([key, value]) => url.searchParams.append(key, value));
  }
  return url.href;
};

export class RefreshSuccess extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class RefreshFailed extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}

/** 捕获并刷新令牌 */
export async function warpperRefreshTokenCatch<R>(tsRouter: TsRouterClass, requestHandle: () => Promise<R>): Promise<R> {
  do {
    try {
      /** 如果正在刷新，暂时阻塞所有的请求 */
      if (tsRouter.isRefreshing) {
        await new Promise((resolve, reject) => tsRouter.interceptDuringRefreshResolves.push({ resolve, reject }));
      }
      return await requestHandle();
    } catch (error) {
      if (error instanceof RefreshSuccess) {
        // 刷新成功，重新执行
        console.log('刷新成功，重新执行');
        continue;
      }

      // 这里不做网络检查，放到 this.onResponseError 用户自定义来做吧
      await tsRouter.onResponseError?.(error);
      // todo 这里有问题吧？
      // 刷新失败，抛出异常
      throw error;
    }
  } while (true);
}

export const safeJsonParse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
