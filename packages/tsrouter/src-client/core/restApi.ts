import { ResponseError } from '../error';
import { MethodOptions, TsRouterClass } from '../type';
import type { RestApiMethod } from '@/types';
import { parseUrl } from '../utils';

export async function restApi(this: TsRouterClass, { method, path, query, body, options = {} }: RestApiParams) {
  const headers = options.headers instanceof Headers ? options.headers : new Headers();
  if (this.setHeaders) {
    await this.setHeaders(headers);
  }

  if (options.headers) {
    Object.entries(options.headers).map(([key, value]) => {
      headers.set(key, value);
    });
  }

  if (body) {
    headers.set('Content-Type', 'application/json');
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
    method: method.toUpperCase(),
    headers: headers,
    signal: signal,
    body: ['get', 'sse', 'head'].includes(method) ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    // todo 网络检查
    const status = response.status;

    if (status === 401) {
      // 刷新token续签
      return await this.refreshTokenHandle();
    } else if (status === 403) {
      // IP已被拉黑
      throw new ResponseError({ message: 'IP已被拉黑', status: 403 });
    } else if (status === 429) {
      // IP已被限流
      throw new ResponseError({ message: 'IP已被拉黑', status: 429 });
    } else {
      // todo 后续捕获结果再抛出异常
      let message = await response.text();
      try {
        const obj = JSON.parse(message);
        let _message = obj.msg || obj.message;
        if (_message) message = _message;
      } catch {}
      console.log({ ErrMessage: message });

      throw new ResponseError({ message, status: 400 });
    }
  }

  return response;
}

export type RestApiParams = {
  method: RestApiMethod;
  path: string | string[];
  query?: Record<string, string> | null;
  body?: any;
  options?: MethodOptions;
};
