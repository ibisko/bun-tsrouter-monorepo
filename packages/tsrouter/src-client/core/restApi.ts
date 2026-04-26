import { ResponseError } from '../error';
import { MethodOptions, TsRouterClass } from '../type';
import { RestApiMethod } from '@packages/utils';

export async function restApi(this: TsRouterClass, { method, path, query, body, options = {} }: RestApiParams) {
  // ============ 设置 Headers ============
  const headers = options.headers instanceof Headers ? options.headers : new Headers();
  if (this.setHeaders) {
    await this.setHeaders(headers);
  }
  if (body) {
    headers.set('Content-Type', 'application/json');
  }
  if (options.headers) {
    Object.entries(options.headers).map(([key, val]) => headers.set(key, val));
  }

  // ============ 超时设置 ============
  const defaultAbortController = new AbortController();
  const signalList = [defaultAbortController.signal];
  if (options.signal) {
    signalList.push(options.signal);
  }
  const signal = AbortSignal.any(signalList);
  const timeout = options.timeout ?? this.timeout;
  const timeoutInstance = setTimeout(() => defaultAbortController.abort(), timeout);

  // 不要 jsonRequest 因为里面就已经做了 response.ok 的错误捕获
  const url = new URL(`${this.prefix}/${path.join('/')}`, this.baseUrl);
  if (query) {
    Object.entries(query).forEach(([key, val]) => url.searchParams.append(key, val));
  }

  const reqInit: RequestInit = {
    method: method,
    headers: headers,
    signal: signal,
  };

  if (!['get', 'head'].includes(method)) {
    reqInit.body = JSON.stringify(body);
  }

  const response = await fetch(url, reqInit);

  clearTimeout(timeoutInstance);

  if (!response.ok) {
    let message = await response.text();
    try {
      const obj = JSON.parse(message);
      let _message = obj.msg || obj.message;
      if (_message) message = _message;
    } catch {}

    switch (response.status) {
      case 401:
        // 刷新token续签
        await this.refreshTokenHandle(); // 只要定义了 refreshToken 就会抛异常，如果没有那就用下面抛出异常
        throw new ResponseError({ message, status: response.status });

      case 403:
        // IP已被拉黑
        throw new ResponseError({ message: message || 'IP已被拉黑', status: response.status });

      case 429:
        // IP已被限流
        throw new ResponseError({ message: message || 'IP已被限流', status: response.status });

      default:
        throw new ResponseError({ message, status: response.status });
    }
  }

  return response;
}

export type RestApiParams = {
  method: RestApiMethod;
  path: string[];
  query?: Record<string, string> | null;
  body?: any;
  options?: MethodOptions;
};
