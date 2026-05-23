import { procedure } from '@packages/tsrouter/server';
import { type Gemini, geminiRequestSchema, geminiParseStreamJson, wrapperSSEStream } from '@packages/gpt';
import { jsonRequest } from '@packages/utils';
import agentTools from '@/agents/core/agentTools';
import { ToolKey } from '@/common/tools';

// todo 尝试下兼容 gpt config, 最好带有 gemini 扩展字段

export const geminiChatRouter = procedure.sse(geminiRequestSchema, async ({ model, system, messages }, { write, signal }) => {
  const body = {
    system_instruction: { parts: [{ text: system }] },
    contents: messages,
    generationConfig: {
      thinkingConfig: {
        thinkingLevel: 'low',
        includeThoughts: true,
      },
    },
    // tools: [agentTools.getToolsParameters([ToolKey.WebSearch], 'gemini')],
  };
  // console.log(JSON.stringify(body, null, 4));

  const response = await jsonRequest({
    method: 'POST',
    baseUrl: process.env.GEMINI_URL,
    url: `/v1beta/models/${model}:streamGenerateContent?alt=sse`,
    headers: new Headers({ 'x-goog-api-key': process.env.GEMINI_API_KEY }),
    body,
    signal,
  });

  // const choicesToolCalls: Gemini.ChoicesToolCalls[] = [];

  // const writer = Bun.file('gemini.log').writer();
  await wrapperSSEStream<Gemini.StreamResponse>(response, async streamJson => {
    // await writer.write(JSON.stringify(streamJson) + '\n');
    await geminiParseStreamJson(streamJson, write);
  });
  // await writer.end();

  // if (choicesToolCalls.length) {
  //   await write(JSON.stringify(choicesToolCalls), 'choicesToolCalls');
  // }
});
