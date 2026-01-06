import { createRecursiveProxy, retryHandle } from '@packages/utils';
import { RefreshFailed, RefreshSuccess, warpperRefreshTokenCatch } from './utils';
import type { MethodOptions, TsRouterClass, TsRouterOptions } from './type';
import { restApi } from './core/restApi';
import { sse } from './core/sse';

// todo formData xhr 流式上传
// todo post 提交form表单资源，流式上传
export class TsRouter implements TsRouterClass {
  readonly baseUrl: string;
  readonly prefix?: string;
  readonly timeout?: number;
  isRefreshing = false;
  interceptDuringRefreshResolves: { resolve: (val?: unknown) => void; reject: (error: Error) => void }[] = [];
  setHeaders: TsRouterOptions['setHeaders'];
  refreshToken: TsRouterOptions['refreshToken'];
  onResponseError: TsRouterOptions['onResponseError'];

  constructor(options: TsRouterOptions) {
    this.baseUrl = options.baseUrl;
    this.prefix = options.prefix;
    this.timeout = options.timeout;
    this.setHeaders = options.setHeaders;
    this.refreshToken = options.refreshToken;
    this.onResponseError = options.onResponseError;
  }

  get(path: string | string[], query: Record<string, string> | null, options: Omit<MethodOptions, 'query'>) {
    return warpperRefreshTokenCatch.bind(this)(() => restApi.bind(this)({ method: 'get', path, query, options }));
  }
  post(path: string | string[], body: any, options: MethodOptions) {
    return warpperRefreshTokenCatch.bind(this)(() => restApi.bind(this)({ method: 'post', path, body, options }));
  }
  patch(path: string | string[], body: any, options: MethodOptions) {
    return warpperRefreshTokenCatch.bind(this)(() => restApi.bind(this)({ method: 'patch', path, body, options }));
  }
  put(path: string | string[], body: any, options: MethodOptions) {
    return warpperRefreshTokenCatch.bind(this)(() => restApi.bind(this)({ method: 'put', path, body, options }));
  }
  delete(path: string | string[], body: any, options: MethodOptions) {
    return warpperRefreshTokenCatch.bind(this)(() => restApi.bind(this)({ method: 'delete', path, body, options }));
  }
  sse(path: string | string[], query: Record<string, string>, options: Omit<MethodOptions, 'query'> = {}) {
    return (callback: (data: any) => void) => warpperRefreshTokenCatch.bind(this)(() => sse.bind(this)(path, query, options)(callback));
  }

  async refreshTokenHandle() {
    this.isRefreshing = true;
    try {
      await retryHandle(this.refreshToken);
      this.interceptDuringRefreshResolves.forEach(item => item.resolve());
      this.isRefreshing = false;
      throw new RefreshSuccess();
    } catch (error) {
      if (error instanceof RefreshSuccess) {
        throw error;
      }
      this.interceptDuringRefreshResolves.forEach(item => item.reject(new RefreshFailed()));
      this.isRefreshing = false;
      throw new RefreshFailed();
    }
  }
}

export const createAppRouter = <T>(tsRouter: TsRouter) =>
  createRecursiveProxy<T>({
    get: tsRouter.get.bind(tsRouter),
    post: tsRouter.post.bind(tsRouter),
    patch: tsRouter.patch.bind(tsRouter),
    put: tsRouter.put.bind(tsRouter),
    delete: tsRouter.delete.bind(tsRouter),
    sse: tsRouter.sse.bind(tsRouter),
  });
