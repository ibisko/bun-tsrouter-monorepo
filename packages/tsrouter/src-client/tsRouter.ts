import { createRecursiveProxy, retryHandle } from '@packages/utils';
import { appendHeaders, parseUrl, RefreshFailed, RefreshSuccess } from './utils';
import type { MethodOptions, RestApiParams, TsRouterOptions } from './type';
import { ResponseError } from './error';

// todo formData xhr 流式上传
// todo post 提交form表单资源，流式上传
export class TsRouter {
  readonly baseUrl: string;
  readonly prefix?: string;
  readonly timeout?: number;
  // readonly headers: HeadersInit;
  headers?: () => Headers;
  refreshToken: (abort: () => void) => Promise<void>;
  onResponseError: (error: unknown) => void;

  isRefreshing = false;
  interceptDuringRefreshResolves: { resolve: (val?: unknown) => void; reject: (error: Error) => void }[] = [];

  constructor(options: TsRouterOptions) {
    this.baseUrl = options.baseUrl;
    this.prefix = options.prefix;
    this.headers = options.headers;
    this.timeout = options.timeout;
    this.refreshToken = options.refreshToken;
    this.onResponseError = options.onResponseError;
  }

  async #restApi({ method, path, query, body, options = {} }: RestApiParams) {
    const headers = this.headers ? this.headers() : new Headers();

    console.log('options.headers:', options.headers);
    appendHeaders(headers, options.headers);
    if (!headers.has('authorization')) {
      appendHeaders(headers, {
        Authorization: `Bearer ${'?'}`,
      });
    }
    if (body) {
      appendHeaders(headers, {
        'Content-Type': 'application/json',
      });
    }

    // 超时中断
    const controller = new AbortController();
    const signals = [controller.signal];
    if (options.signal) {
      signals.push(options.signal);
    }
    const signal = AbortSignal.any(signals);
    if (this.timeout || options.timeout) {
      setTimeout(() => controller.abort(), options.timeout ?? this.timeout);
    }

    const url = parseUrl({ baseUrl: this.baseUrl, prefix: this.prefix, path, query });
    const response = await fetch(url, {
      method,
      headers: headers,
      signal: signal,
      body: ['get', 'sse', 'head'].includes(method) ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
      // todo 网络检查
      const status = response.status;
      if (status === 400) {
        // todo 后续捕获结果再抛出异常
        const resdata = await response.json();
        throw new ResponseError({ message: resdata?.msg, status: 400 });
      } else if (status === 401) {
        // 刷新token续签
        return await this.#refreshTokenHandle();
      } else if (status === 403) {
        // IP已被拉黑
        throw new ResponseError({ message: 'IP已被拉黑', status: 403 });
      } else if (status === 429) {
        // IP已被限流
        throw new ResponseError({ message: 'IP已被拉黑', status: 429 });
      }
    }

    return response;
  }

  // todo query options 都可以只有一个，怎么办😰
  get(path: string | string[], query: Record<string, string>, options: Omit<MethodOptions, 'query'>) {
    return this.#warpperRefreshTokenCatch(() => this.#restApi({ method: 'get', path, query, options }));
  }
  post(path: string | string[], body: any, options: MethodOptions) {
    return this.#warpperRefreshTokenCatch(() => this.#restApi({ method: 'post', path, body, options }));
  }
  patch(path: string | string[], body: any, options: MethodOptions) {
    return this.#warpperRefreshTokenCatch(() => this.#restApi({ method: 'patch', path, body, options }));
  }
  put(path: string | string[], body: any, options: MethodOptions) {
    return this.#warpperRefreshTokenCatch(() => this.#restApi({ method: 'put', path, body, options }));
  }
  delete(path: string | string[], body: any, options: MethodOptions) {
    return this.#warpperRefreshTokenCatch(() => this.#restApi({ method: 'delete', path, body, options }));
  }

  #sse(path: string | string[], query: Record<string, string>, options: MethodOptions) {
    return async (callback: (data: any) => void) => {
      options.headers ??= {};
      options.headers = new Headers(options.headers);
      options.headers.append('Accept', 'text/event-stream');

      const response = await this.#restApi({
        method: 'get',
        path,
        query,
        options,
      });
      if (!response) return;

      const reader = response.body!.getReader();
      let finish = false;
      do {
        const { value, done } = await reader.read();
        finish = done;
        if (!done) {
          const td = new TextDecoder();
          td.decode(value)
            .split('\n\n')
            .filter(item => item)
            .map(content =>
              content.split('\n').reduce<{ [k: string]: any }>((res, line) => {
                const regexp = /^(\S+)\:\s+?(.*)/.exec(line);
                if (regexp) {
                  const key = regexp[1];
                  let val = regexp[2];
                  if (key === 'id') {
                    res[key] = +val;
                  } else {
                    res[key] = val;
                  }
                }
                return res;
              }, {}),
            )
            .forEach(callback);
        }
      } while (!finish);
    };
  }

  sse(path: string, query: Record<string, string>, options: Omit<MethodOptions, 'query'> = {}) {
    return async (callback: (data: any) => void) =>
      this.#warpperRefreshTokenCatch(() => this.#sse(path, query, options)(callback));
  }

  async #warpperRefreshTokenCatch(callback: () => Promise<Response | void>) {
    do {
      try {
        await this.#interceptDuringRefresh();
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

  /** 如果正在刷新，暂时阻塞所有的请求 */
  #interceptDuringRefresh() {
    if (!this.isRefreshing) return;
    return new Promise((resolve, reject) => this.interceptDuringRefreshResolves.push({ resolve, reject }));
  }

  async #refreshTokenHandle() {
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

// new TsRouter()

export const createAppRouter = <T>(tsRouter: TsRouter) => {
  return createRecursiveProxy<T, string>({
    get: tsRouter.get.bind(tsRouter),
    post: tsRouter.post.bind(tsRouter),
    patch: tsRouter.patch.bind(tsRouter),
    put: tsRouter.put.bind(tsRouter),
    delete: tsRouter.delete.bind(tsRouter),
    sse: tsRouter.sse.bind(tsRouter),
  });
};
