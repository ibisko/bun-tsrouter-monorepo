import { Gemini } from '@/types/gemini';
import { MessageType, SseCallback } from '@/types';

export const geminiParseStreamJson = async (streamJson: Gemini.StreamResponse[], cb: SseCallback) => {
  let usage: Gemini.UsageMetadata | undefined = undefined;
  let thought = '';
  let content = '';
  // const toolCalls: Gemini.ToolCall[] = [];

  for (const item of streamJson) {
    for (const candidate of item.candidates) {
      for (const part of candidate.content.parts) {
        if (part.functionCall) {
          // toolCalls.push(part.functionCall);
          const toolCall = part.functionCall;
          await cb(
            {
              id: toolCall.id,
              name: toolCall.name,
              args: toolCall.args,
            },
            MessageType.Tools,
          );
        }
        if (part.thought) {
          thought += part.text;
        } else {
          content += part.text;
        }
      }
    }
    if (item.usageMetadata) {
      usage = item.usageMetadata;
    }
  }

  if (thought) await cb(thought, MessageType.Thinking);
  if (content) await cb(content, MessageType.Content);
  if (usage) await cb(usage, MessageType.Usage);
  // if (toolCalls.length) await cb(toolCalls, MessageType.Tools);
};
