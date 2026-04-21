import z from 'zod';
import { MaybePromise } from 'bun';
import { GLM } from '@/types/glm';

export const createStreamToJson = () => {
  let cache = ''; // todo 真的适合放这里吗，需要检查每次进来的data是否都是data:开头
  let type = '';
  return (data: string) => {
    if (!data.startsWith('data:')) {
      console.log({ cache, data, cache_data: cache + data });
      data = cache + data;
    }

    const items = data.split('\n').filter(item => !!item);

    const resJsons = [];

    for (const item of items) {
      let strdata = item;
      const data = /^data:\s+(.*)/.exec(item);
      if (data) {
        // console.log('no data:', data);
        strdata = data[1]!;
      }
      if (strdata === '[DONE]') {
        // console.log("[DONE]data:", data);
        break;
      }

      let res;
      try {
        // todo 不连续的 jsonstring
        res = JSON.parse(strdata) as GLM.StreamResponse;
        cache = '';
      } catch (error) {
        const hasCache = !!cache;
        cache += strdata;
        if (hasCache) {
          try {
            // todo 未验证
            // todo 感觉这里写得太丑了
            console.log('<{cache}>');
            res = JSON.parse(cache) as GLM.StreamResponse;
          } catch (error) {}
        }

        if (error instanceof Error) {
          console.log('Error strdata:', strdata);
        }
        continue;
      }

      resJsons.push(res);
    }
    return resJsons;
  };
};

export const parseStreamJson = (streamJson: GLM.StreamResponse[], cb: Callback) => {
  let usage: GLM.Usage | undefined = undefined;
  let reasoning_content = '';
  let content = '';
  const tool_calls: GLM.ChoicesToolCalls[] = [];

  for (const item of streamJson) {
    for (const chiocs of item.choices) {
      if (chiocs.delta.reasoning_content) {
        reasoning_content += chiocs.delta.reasoning_content;
      }
      if (chiocs.delta.content) {
        content += chiocs.delta.content;
      }
      if (chiocs.delta.tool_calls) {
        tool_calls.push(...chiocs.delta.tool_calls);
      }
    }
    if (item.usage) {
      usage = item.usage;
    }
  }

  if (reasoning_content) {
    cb(reasoning_content, 'thinking');
  }

  if (content) {
    cb(content, 'content');
  }

  return { usage, tool_calls };
};

type Callback = (data: string, type: 'thinking' | 'content') => MaybePromise<void>;
