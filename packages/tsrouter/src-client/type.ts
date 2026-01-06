import { MaybePromise } from '@packages/utils/types';

export type RestApiMethod = 'get' | 'post' | 'patch' | 'put' | 'delete';
// export type Method = RestApiMethod | 'sse' | 'uploadFile';

export type TsRouterOptions = {
  baseUrl: string;
  prefix?: string;
  timeout?: number;
  setHeaders?: (headers: Headers) => MaybePromise<void>;
  refreshToken: (abort: () => void) => Promise<void>;
  onResponseError: (error: unknown) => void;
};

export type MethodOptions = {
  query?: Record<string, string>;
  headers?: Record<string, string>;
  /** 用于 Controller 中断 */
  signal?: AbortSignal;
  timeout?: number;
};

export type UploadMethodOptions = MethodOptions & {
  onPercent?: (percent: number) => void;
};

export type RestApiParams = {
  method: RestApiMethod;
  path: string | string[];
  query?: Record<string, string> | null;
  body?: any;
  options?: MethodOptions;
};

export abstract class TsRouterClass {
  abstract baseUrl: string;
  abstract isRefreshing: boolean;
  abstract prefix?: string;
  abstract timeout?: number;
  abstract interceptDuringRefreshResolves: { resolve: (val?: unknown) => void; reject: (error: Error) => void }[];
  abstract setHeaders: TsRouterOptions['setHeaders'];
  abstract refreshToken: TsRouterOptions['refreshToken'];
  abstract onResponseError: TsRouterOptions['onResponseError'];
  abstract refreshTokenHandle: () => Promise<void>;
}
