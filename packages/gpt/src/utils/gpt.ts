import { GPT, MessageType, SseCallback } from '@/types';

export const gptParseStreamJson = async (streamJson: GPT.StreamResponse[], cb: SseCallback) => {
  let usage: GPT.Usage | undefined = undefined;
  let thinking = '';
  let content = '';

  for (const item of streamJson) {
    for (const chiocs of item.choices) {
      if (chiocs.delta.reasoning_content) {
        thinking += chiocs.delta.reasoning_content;
      }
      if (chiocs.delta.content) {
        content += chiocs.delta.content;
      }
      if (chiocs.delta.tool_calls) {
        for (const tool of chiocs.delta.tool_calls) {
          await cb(
            {
              id: tool.id,
              name: tool.function.name,
              args: JSON.parse(tool.function.arguments.trim()),
            },
            MessageType.Tools,
          );
        }
      }
    }
    if (item.usage) {
      usage = item.usage;
    }
  }

  if (thinking) await cb(thinking, MessageType.Thinking);
  if (content) await cb(content, MessageType.Content);
  if (usage) await cb(usage, MessageType.Usage);
};
