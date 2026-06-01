import { createRecursiveProxy, retryHandle } from '@packages/utils';
import { RefreshFailed, RefreshSuccess } from './utils';
import type { TsRouterClass, TsRouterOptions } from './type';
import { createGetMethod, createStandardMethod, createPostFormData, createDownloadMethod } from './core/restApi';
import { createSseMethod } from './core/sse';
import { createPutFile } from './core/putFile';

// todo formData xhr 流式上传
// todo post 提交form表单资源，流式上传
export class TsRouter implements TsRouterClass {
  readonly baseUrl: string;
  readonly prefix?: string;
  readonly timeout: number = 1e3 * 60;
  isRefreshing = false;
  interceptDuringRefreshResolves: { resolve: (val?: unknown) => void; reject: (error: Error) => void }[] = [];
  setHeaders: TsRouterOptions['setHeaders'];
  refreshToken: TsRouterOptions['refreshToken'];
  onResponseError: TsRouterOptions['onResponseError'];

  constructor(options: TsRouterOptions) {
    this.baseUrl = options.baseUrl;
    this.prefix = options.prefix;
    this.timeout = options.timeout ?? this.timeout;
    this.setHeaders = options.setHeaders;
    this.refreshToken = options.refreshToken;
    this.onResponseError = options.onResponseError;
  }

  async refreshTokenHandle() {
    if (!this.refreshToken) return;
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
    get: createGetMethod(tsRouter),
    post: createStandardMethod(tsRouter, 'POST'),
    patch: createStandardMethod(tsRouter, 'PATCH'),
    put: createStandardMethod(tsRouter, 'PUT'),
    delete: createStandardMethod(tsRouter, 'DELETE'),
    sse: createSseMethod(tsRouter),
    postFormData: createPostFormData(tsRouter),
    putFile: createPutFile(tsRouter),
    download: createDownloadMethod(tsRouter),
  });
