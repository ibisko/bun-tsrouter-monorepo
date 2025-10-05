export type TsRouterOptions = {
  baseUrl: string;
  prefix?: string;
  headers?: HeadersInit;
  timeout?: number;
  refreshToken: (abort: () => void) => Promise<void>;
};

export type MethodOptions = {
  query?: Record<string, string>;
  headers?: HeadersInit;
  /** 用于 Controller 中断 */
  signal?: AbortSignal;
  timeout?: number;
};

export type RestApiParams = {
  method: 'get' | 'post' | 'patch' | 'delete' | 'put';
  path: string | string[];
  query?: Record<string, string>;
  body?: any;
  options?: MethodOptions;
};
