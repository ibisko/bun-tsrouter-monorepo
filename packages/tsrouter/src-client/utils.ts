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

// ==========================

export async function warpperRefreshTokenCatch(this: TsRouterClass, callback: () => Promise<Response | void>) {
  do {
    try {
      /** 如果正在刷新，暂时阻塞所有的请求 */
      if (this.isRefreshing) {
        await new Promise((resolve, reject) => this.interceptDuringRefreshResolves.push({ resolve, reject }));
      }
      const response = await callback();
      try {
        return response?.json();
      } catch (error) {
        return response?.text();
      }
    } catch (error) {
      if (error instanceof RefreshSuccess) {
        // 刷新成功，重新执行
        console.log('刷新成功，重新执行');
        continue;
      }
      // todo 网络断开就等待10s后无限重试，直到离开页面的 abort
      // todo 离开页面的 abort
      this.onResponseError(error);
      // todo 触发钩子
      // 刷新失败，抛出异常
      throw error;
    }
  } while (true);
}
