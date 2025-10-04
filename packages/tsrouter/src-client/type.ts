export type TsRouterOptions = {
  baseUrl: string;
  prefix?: string;
  refreshToken: (abort: () => void) => Promise<void>;
};

export type MethodOptions = {
  query?: Record<string, string>;
  // headers?: Record<string, string>;
  headers?: HeadersInit;
  /** 用于 Controller 中断 */
  signal?: AbortSignal;
  timeout?: number;
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

export type RestApiParams = {
  method: 'get' | 'post' | 'patch' | 'delete' | 'put';
  path: string | string[];
  query?: Record<string, string>;
  body?: any;
  options?: MethodOptions;
};
