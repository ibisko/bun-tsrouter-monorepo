export type TsRouterOptions = {
  baseUrl: string;
  prefix?: string;
  headers?: () => Headers;
  timeout?: number;
  refreshToken: (abort: () => void) => Promise<void>;
  onResponseError: (error: unknown) => void;
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
  query?: Record<string, string> | null;
  body?: any;
  options?: MethodOptions;
};
