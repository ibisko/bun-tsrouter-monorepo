import { createGptServices } from '@/services/llm/gpt/createGptServices';
import { GPT, MessageType, ToolCall } from '@packages/gpt';

export type LlmHandleCallbackParam = {
  content: string;
  tools: ToolCall[];
};

type LlmHandleParam = {
  system: string;
  messages: GPT.Message[];
  tools: GPT.Tool[];

  signal: AbortSignal;
  writeEvent: (data: any, event?: string) => void;
  callback: (param: LlmHandleCallbackParam) => Promise<GPT.Message[] | void>;
};

export const llmHandle = async ({ system, messages, tools, signal, writeEvent, callback }: LlmHandleParam) => {
  const services = createGptServices({
    baseUrl: process.env.GLM_BASE_URL,
    url: '/api/coding/paas/v4/chat/completions',
    token: process.env.GLM_API_KEY,
  });

  while (true) {
    let completeContent = '';
    const toolCalls: ToolCall[] = [];
    await services(
      {
        model: 'glm-5.1',
        system,
        messages,
        tools, // todo 注册
        thinking: true,
        jsonFormat: true,
      },
      {
        write: async (data, event) => {
          writeEvent(data, event);
          if (event === MessageType.Content) {
            completeContent += data;
          } else if (event === MessageType.Tools) {
            console.log('>>>data(tools)', data);
            toolCalls.push(data);
          }
        },
        signal: signal,
      },
    );

    const results = await callback({
      content: completeContent,
      tools: toolCalls,
    });

    if (!results?.length) break;

    messages.push(...results);
  }
};
