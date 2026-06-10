import { ResponseError } from '../error';
import { MethodOptions, SseMessageHandler, TsRouterClass } from '../type';
import { warpperRefreshTokenCatch } from '../utils';
import { baseFetch } from './baseFetch';

const sseMessageCallback = (body: ReadableStream) => async (callback: SseMessageHandler) => {
  for await (const chunk of body.pipeThrough(new TextDecoderStream())) {
    const contents = chunk.split('\n\n');

    for (const item of contents) {
      const content = item.trim();
      if (!content) continue;
      if (content === ':') continue; // 心跳

      let obj;
      try {
        obj = JSON.parse(content);
      } catch {
        throw new ResponseError({ message: `SSE parse json Error: ${content}`, status: 200 });
      }
      if (obj.event === 'SERVICE_ERROR') throw new ResponseError({ message: obj.data, status: 200 });
      callback(obj);
    }
  }
};

export const createSseMethod =
  (tsRouter: TsRouterClass) =>
  async (path: string[], body: any, options: MethodOptions = {}) => {
    options.headers ??= {};
    Object.assign(options.headers, { accept: 'text/event-stream' });

    const fn = () => baseFetch(tsRouter, { method: 'POST', path, body, options });
    const response = options.skipRefreshToken ? await fn() : await warpperRefreshTokenCatch(tsRouter, fn);
    if (!response.body) throw new Error('no body');
    return sseMessageCallback(response.body);
  };
