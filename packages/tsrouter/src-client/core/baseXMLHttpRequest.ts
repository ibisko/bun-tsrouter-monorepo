import { RestApiMethod } from '@packages/utils';
import { ResponseError } from '../error';
import type { TsRouterClass, XhrMethodOptions } from '../type';
import { parseUrl, safeJsonParse } from '../utils';

export const baseXMLHttpRequest = (tsRouter: TsRouterClass, { path, method, body, options = {} }: BaseXMLHttpRequestParams) =>
  new Promise(async (resolve, reject) => {
    const url = parseUrl({
      baseUrl: tsRouter.baseUrl,
      prefix: tsRouter.prefix,
      path,
      query: options.query,
    });

    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    const headers = new Headers();
    if (tsRouter.setHeaders) await tsRouter.setHeaders(headers);
    if (options.headers) Object.entries(options.headers).map(([key, val]) => headers.set(key, val));
    headers.entries().forEach(([key, value]) => xhr.setRequestHeader(key, value));

    if (options.onPercent) {
      xhr.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          const percent = ((event.loaded / event.total) * 10000) / 100;
          options.onPercent!(percent);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(safeJsonParse(xhr.response));
      } else if (xhr.status >= 400) {
        // todo 给个特别的
        reject(new ResponseError({ message: xhr.response, status: xhr.status }));
      }
    });

    xhr.addEventListener('error', async () => {
      let message = await xhr.response;
      try {
        const obj = JSON.parse(message);
        message = obj.msg ?? obj.message ?? message;
      } catch {}

      switch (xhr.status) {
        case 401:
          // 刷新token续签
          try {
            await tsRouter.refreshTokenHandle(); // 只要定义了 refreshToken 就会抛异常，如果没有那就用下面抛出异常
          } catch (error) {
            return reject(error);
          }
          reject(new ResponseError({ message, status: xhr.status }));

        case 403:
          // IP已被拉黑
          reject(new ResponseError({ message: message ?? 'IP已被拉黑', status: xhr.status }));

        case 429:
          // IP已被限流
          reject(new ResponseError({ message: message ?? 'IP已被限流', status: xhr.status }));

        default:
          reject(new ResponseError({ message, status: xhr.status }));
      }

      console.log('--- XHR error ---', { status: xhr.status, message });
    });

    xhr.addEventListener('abort', () => reject(new Error('上传被取消')));

    xhr.send(body);
  });

type BaseXMLHttpRequestParams = {
  path: string[];
  method: Uppercase<RestApiMethod>;
  body: XMLHttpRequestBodyInit;
  options?: XhrMethodOptions;
};
