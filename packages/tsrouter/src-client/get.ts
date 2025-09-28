import { createRecursiveProxy, retryHandle } from '@packages/utils';
import { parseUrl } from '@/utils/index';

type TsRouterOptions = {
  baseUrl: string;
  prefix?: string;
  refreshToken: (abort: () => void) => Promise<void>;
};

export class TsRouter {
  readonly baseUrl: string;
  readonly prefix?: string;
  refreshToken: (abort: () => void) => Promise<void>;

  isRefreshing = false;
  interceptDuringRefreshResolves: { resolve: (val?: unknown) => void; reject: (error: Error) => void }[] = [];

  constructor(options: TsRouterOptions) {
    this.baseUrl = options.baseUrl;
    this.prefix = options.prefix;
    this.refreshToken = options.refreshToken;
  }

  #getPath = (path: string | string[], query?: Record<string, string>) =>
    parseUrl({ baseUrl: this.baseUrl, prefix: this.prefix, path, query });

  interceptDuringRefresh() {
    if (!this.isRefreshing) return;
    return new Promise((resolve, reject) => this.interceptDuringRefreshResolves.push({ resolve, reject }));
  }

  async #get(
    path: string | string[],
    query: Record<string, string>,
    options: MethodOptions = {
      headers: {},
    },
  ) {
    options.headers ??= {};
    const headers = Object.assign(options.headers, {
      // todo token
      Authorization: `Bearer ${''}`,
      // todo token 可以不带，options 里怎么配置
    });
    const response = await fetch(this.#getPath(path, query), {
      method: 'GET',
      headers,
      signal: options.signal,
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 400) {
        // todo 后续捕获结果再抛出异常
      } else if (status === 401) {
        // 刷新token续签
        return await this.#refreshTokenHandle();
      } else if (status === 403) {
        // IP已被拉黑
      } else if (status === 429) {
        // IP已被限流
        return;
      }
    }
    if (!response.body) {
      // todo ...
      throw new Error('???');
    }
    return await response.json();
  }

  // todo 先实现完善的 get 请求方式
  get(
    path: string | string[],
    query: Record<string, string>,
    options: MethodOptions = {
      headers: {},
    },
  ) {
    return this.warpperRefreshTokenCatch(() => this.#get(path, query, options));
  }

  // todo 设计并实现sse
  #sse(
    path: string | string[],
    query: Record<string, string>,
    options: MethodOptions = {
      headers: {},
    },
  ) {
    return async (callback: (data: any) => void) => {
      options.headers ??= {};

      console.log('query:', query);

      // todo 刷新时，方法入栈
      const headers = Object.assign(options.headers, {
        // 'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        // todo token
        // todo token 可以不带，options 里怎么配置
      });
      const response = await fetch(this.#getPath(path, query), {
        method: 'GET',
        headers,
        /**
         * ```ts
         * const controller = new AbortController();
         * fetch('/api', { signal: controller.signal });
         * controller.abort(); // 取消请求
         * ```
         */
        signal: options.signal,

        /**
         *  GET、HEAD、SSE 请求不能包含 body
         */
        // body:

        /**
         * 携带 cookies 凭证
         * - omit (默认)绝不发送或接收任何凭证
         * - same-origin 仅在请求同源 URL 时发送凭证
         * - include 总是发送凭证，即使跨域
         */
        // credentials: 'omit'

        /**
         * 控制请求与浏览器缓存的交互方式。
         * - default
         * - force-cache
         * - no-cache
         * - no-store
         * - only-if-cached
         * - reload
         */
        // cache:

        /**
         * 指定是否允许跨域请求。
         * - cors (默认)允许跨域请求。
         * - same-origin 只允许同源请求。
         * - no-cors 允许跨域，但只能使用简单的请求方法和头。
         */
        // mode:

        /**
         * 指定如何处理重定向响应。
         * - follow (默认)自动跟随重定向。
         * - error 如果遇到重定向，则抛出错误。
         * - manual 手动处理重定向。
         */
        // redirect:

        /** 指示请求在页面卸载后是否继续执行（用于发送埋点数据等） */
        // keepalive:

        /**
         * integrity主要用于 CDN 资源校验​​。
         */
        // integrity:
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 400) {
          console.log('status 400 捕获');

          // todo 后续捕获结果再抛出异常
        } else if (status === 401) {
          // todo 刷新token续签
          return;
        } else if (status === 403) {
          // IP已被拉黑
        } else if (status === 429) {
          // IP已被限流
          return;
        }
      }
      if (!response.body) {
        // todo ...
        throw new Error('???');
      }
      // return await response.json();

      const reader = response.body.getReader();
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

  sse(
    path: string,
    query: Record<string, string>,
    options: MethodOptions = {
      headers: {},
    },
  ) {
    return async (callback: (data: any) => void) =>
      this.warpperRefreshTokenCatch(() => this.#sse(path, query, options)(callback));
  }

  // todo post
  // todo post 提交form表单资源，流式上传
  // todo patch
  // todo put
  // todo delete

  async #refreshTokenHandle() {
    this.isRefreshing = true;
    try {
      await retryHandle(this.refreshToken);
      this.interceptDuringRefreshResolves.forEach(item => item.resolve());
      this.isRefreshing = false;
      throw new RefreshSuccess();
    } catch (error) {
      this.interceptDuringRefreshResolves.forEach(item => item.reject(new RefreshFailed()));
      this.isRefreshing = false;
      throw new RefreshFailed();
    }
  }

  async warpperRefreshTokenCatch(callback: () => Promise<unknown>) {
    do {
      try {
        // 刷新时，方法入栈
        await this.interceptDuringRefresh();
        return callback();
      } catch (error) {
        if (error instanceof RefreshSuccess) {
          // 刷新成功，重新执行
          continue;
        }
        // 刷新失败，抛出异常
        throw error;
      }
    } while (true);
  }
}

type MethodOptions = {
  // headers?: Record<string, string>;
  headers?: HeadersInit;
  /** 用于 Controller 中断 */
  signal?: AbortSignal;
  timeout?: number;
};

class RefreshSuccess extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}
class RefreshFailed extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export const createAppRouter = <T>(tsRouter: TsRouter) => {
  return createRecursiveProxy<T, string>({
    get: tsRouter.get.bind(tsRouter),
    sse: tsRouter.sse.bind(tsRouter),
  });
};
