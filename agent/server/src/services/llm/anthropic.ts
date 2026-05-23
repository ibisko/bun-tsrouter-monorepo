import { type Anthropic, createAnthropicParseStreamJson, anthropicRequestSchema, wrapperSSEStream } from '@packages/gpt';
import { procedure, SseServiceOptional } from '@packages/tsrouter/server';
import { jsonRequest } from '@packages/utils';
import z from 'zod';
import { CreateLLMRouterParam } from './types';
import agentTools from '@/agents/core/agentTools';
import { ToolKey } from '@/common/tools';

// "https://open.bigmodel.cn/api/anthropic"
// v1/messages

// 尝试直接用 glm api 带上 web_search 参数，感觉是能直接查到的
// 参考 zed ai markdown 的内容

// todo 尝试下兼容 gpt config, 最好带有 anthropic 扩展字段

const createAnthropicChatRouter =
  ({ baseUrl, url, token }: CreateLLMRouterParam) =>
  async (
    { model, system, messages, thinking, tools, max_tokens, temperature }: z.output<typeof anthropicRequestSchema>,
    { write, signal }: SseServiceOptional,
  ) => {
    const body = {
      model,
      system,
      messages,
      thinking: {
        type: thinking ? 'enabled' : 'disabled',
      },
      tools,
      // tools: [...agentTools.getToolsParameters([ToolKey.WebSearch], 'anthropic')],
      /* tools: [
        {
          name: 'web_search',
          type: 'web_search_20260209',
          // allowed_domains: [],
          blocked_domains: ['csdn.net', 'cnblogs.com'], // 过滤掉傻逼网站
          // max_uses: 8, // Hardcoded to 8 searches maximum
        },
      ], */
      max_tokens,
      temperature,
      stream: true,
    };

    // console.log(JSON.stringify(body, null, 4));

    const response = await jsonRequest({
      method: 'POST',
      baseUrl,
      url,
      headers: new Headers({ Authorization: `Bearer ${token}` }),
      body,
      signal,
    });

    // const writer = Bun.file('anthropic.log').writer();
    const anthropicParseStreamJson = createAnthropicParseStreamJson();
    await wrapperSSEStream<Anthropic.StreamResponse>(response, async streamJson => {
      // await writer.write(JSON.stringify(streamJson) + '\n');
      await anthropicParseStreamJson(streamJson, write);
    });
    // await writer.end();
  };

export const glmAnthropicRouter = procedure.sse(
  anthropicRequestSchema.extend({
    model: z.enum(['glm-5.1', 'glm-5-turbo', 'glm-4.7', 'glm-4.6v', 'glm-4.5', 'glm-4.5-air']).optional().default('glm-5.1'),
  }),
  createAnthropicChatRouter({
    baseUrl: process.env.GLM_BASE_URL,
    url: '/api/anthropic/v1/messages',
    token: process.env.GLM_API_KEY,
  }),
);

// todo xiaomi
// todo deepseek
