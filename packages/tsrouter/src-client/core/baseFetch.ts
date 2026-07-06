import { ResponseError } from '../error';
import { MethodOptions, TsRouterClass } from '../type';
import { jsonRequest, RestApiMethod } from '@packages/utils';

export async function baseFetch(tsRouter: TsRouterClass, { method, path, query, body, options = {} }: BaseFetchParam) {
  // ============ 设置 Headers ============
  const headers = new Headers();
  if (tsRouter.setHeaders) await tsRouter.setHeaders(headers);
  if (options.headers) Object.entries(options.headers).map(([key, val]) => headers.set(key, val));

  if (tsRouter.prefix) path = [tsRouter.prefix, ...path];
  const pathname = path.join('/');

  const response = await jsonRequest({
    method,
    baseUrl: tsRouter.baseUrl,
    url: pathname,
    headers,
    body,
    query,
    timeout: options.timeout ?? tsRouter.timeout,
    signal: options.signal,
    skipErrorHandler: true,
  });

  if (!response.ok) {
    let message = await response.text();
    try {
      const obj = JSON.parse(message);
      message = obj.msg ?? obj.message ?? message;
    } catch {}

    switch (response.status) {
      case 401:
        // 刷新token续签
        await tsRouter.refreshTokenHandle(); // 只要定义了 refreshToken 就会抛异常，如果没有那就用下面抛出异常
        throw new ResponseError({ message, status: response.status });

      case 403:
        // IP已被拉黑
        throw new ResponseError({ message: message ?? 'IP已被拉黑', status: response.status });

      case 429:
        // IP已被限流
        throw new ResponseError({ message: message ?? 'IP已被限流', status: response.status });

      default:
        throw new ResponseError({ message, status: response.status });
    }
  }

  return response;
}

export type Query = Record<string, string> | null;

export type BaseFetchParam = {
  method: Uppercase<RestApiMethod>;
  path: string[];
  query?: Query;
  body?: BodyInit;
  options?: MethodOptions;
};
