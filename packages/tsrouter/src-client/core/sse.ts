import { MethodOptions, TsRouterClass } from '../type';
import { restApi } from './restApi';

export function sse(this: TsRouterClass, path: string | string[], query: Record<string, string>, options: MethodOptions) {
  return async (callback: (data: any) => void) => {
    options.headers ??= {};
    Object.assign(options.headers, { accept: 'text/event-stream' });

    const response = await restApi.bind(this)({
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
