import z from 'zod';
import { pick } from 'lodash-es';
import type { MaybePromise } from 'bun';

export { geminiParseStreamJson } from './gemini';
export { gptParseStreamJson } from './gpt';
export { createAnthropicParseStreamJson } from './anthropic';

export type AddTool = {
  name: string;
  description: string;
  parameters: z.ZodType;
};

/** 添加工具 gemini 也同样可用 */
export const createTool = ({ name, description, parameters }: AddTool) => ({
  name,
  description,
  parameters: pick(
    parameters.toJSONSchema({
      target: 'openapi-3.0',
      io: 'input',
    }),
    ['type', 'properties', 'required'],
  ) as any,
});

/** 以 `data:` 开头 */
const createDataStreamToJson = <T>() => {
  let cache = ''; // todo 真的适合放这里吗，需要检查每次进来的data是否都是data:开头
  return (data: string): T[] => {
    if (!data.startsWith('data:')) {
      // console.log({ cache, data, cache_data: cache + data });
      data = cache + data;
    }

    const items = data.split('\n').filter(item => !!item);
    const resJsons: T[] = [];

    for (const item of items) {
      let strdata = item;
      const data = /^data:\s+(.*)/.exec(item);
      if (data) {
        // console.log('no data:', data);
        strdata = data[1]!;
      }
      if (strdata === '[DONE]') {
        // console.log(`[DONE]-item: <${JSON.stringify(items, null, 4)}>`);
        break;
      }

      let res;
      try {
        // todo 不连续的 jsonstring
        res = JSON.parse(strdata.trim());
        cache = '';
      } catch (error) {
        const hasCache = !!cache;
        cache += strdata;
        if (hasCache) {
          try {
            // todo 未验证
            // todo 感觉这里写得太丑了
            console.log('<{cache}>');
            res = JSON.parse(cache);
          } catch (error) {}
        }

        /* if (error instanceof Error) {
          console.log('Error strdata:', strdata);
        } */
        continue;
      }

      resJsons.push(res);
    }
    /* if (cache) {
      console.log(`存在剩余cache: <${cache}>`);
    } */
    return resJsons;
  };
};

export const wrapperSSEStream = async <T>(response: Response, cb: (data: T[]) => MaybePromise<void>) => {
  const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
  if (!reader) throw new Error('no reader');

  const streamToJson = createDataStreamToJson<T>();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const jsons = streamToJson(value);
    await cb(jsons);
  }
};
