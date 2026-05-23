import { type SseServiceOptional } from '@packages/tsrouter/server';
import { GPT, wrapperSSEStream, gptParseStreamJson } from '@packages/gpt';
import { jsonRequest } from '@packages/utils';
import { CreateLLMRouterParam } from '../types';
// import agentTools from '@/agents/core/agentTools';
// import { ToolKey } from '@/common/tools';

export const createGptServices =
  ({ baseUrl, url, token }: CreateLLMRouterParam) =>
  async (param: GPT.BaseRequestSchemaType, { write, signal }: Pick<SseServiceOptional, 'write'> & { signal?: AbortSignal }) => {
    if (param.system) {
      param.messages.unshift({
        role: GPT.Role.System,
        content: param.system,
      });
    }

    const body = {
      model: param.model,
      messages: param.messages,
      tools: param.tools,
      // tools: agentTools.getToolsParameters([ToolKey.WebSearch]),
      temperature: param.temperature,
      // todo gpt 接口不支持 thinking 属性吧
      thinking: {
        type: param.thinking ? 'enabled' : 'disabled',
      },
      response_format: {
        type: param.jsonFormat ? 'json_object' : 'text',
      },
      stream: true,
    };

    const headers = new Headers({ Authorization: `Bearer ${token}` });

    const response = await jsonRequest({
      method: 'POST',
      baseUrl,
      url,
      headers,
      body,
      signal,
    });

    // const writer = Bun.file('gpt.log').writer();
    await wrapperSSEStream<GPT.StreamResponse>(response, async streamJson => {
      // for (const item of streamJson) await writer.write(JSON.stringify(item) + '\n');
      await gptParseStreamJson(streamJson, write);
    });
    // await writer.end();
  };
