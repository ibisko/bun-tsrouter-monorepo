import { ResponseError } from '../error';
import { MethodOptions, SseMessageHandler, TsRouterClass } from '../type';
import { restApi } from './restApi';

export async function sse(this: TsRouterClass, path: string[], body: any, options: MethodOptions) {
  options.headers ??= {};
  Object.assign(options.headers, { accept: 'text/event-stream' });

  const response = await restApi.bind(this)({
    method: 'post',
    path,
    body,
    options,
  });

  return async (callback: SseMessageHandler) => {
    if (!response.body) throw new Error('no body');

    for await (const chunk of response.body.pipeThrough(new TextDecoderStream())) {
      const contents = chunk.split('\n\n');
      for (let content of contents) {
        content = content.trim();
        if (!content) continue;
        if (content === ':') continue; // 心跳
        let obj;
        try {
          obj = JSON.parse(content);
        } catch (error) {
          throw new ResponseError({ message: 'sse 返回值 data json解析有问题', status: 200 });
        }
        if (obj.event === 'SERVICE_ERROR') {
          throw new ResponseError({ message: obj.data, status: 200 });
        }
        callback(obj);
      }
    }
  };
}
