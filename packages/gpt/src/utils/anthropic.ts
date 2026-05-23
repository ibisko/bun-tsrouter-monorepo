import type { Anthropic } from '@/types/anthropic';
import { MessageType, SseCallback } from '@/types';

export const createAnthropicParseStreamJson = () => {
  let toolId = '';
  let toolName = '';
  let toolCall = '';

  return async (streamJson: Anthropic.StreamResponse[], cb: SseCallback) => {
    let usage: Anthropic.Usage | undefined = undefined;
    // let partial_json;
    for (const item of streamJson) {
      if (item.type === 'ping') continue;
      if (item.type === 'content_block_delta') {
        if (item.delta.type === 'thinking_delta') {
          await cb(item.delta.thinking, MessageType.Thinking);
        } else if (item.delta.type === 'text_delta') {
          await cb(item.delta.text, MessageType.Content);
        } else if (item.delta.type === 'input_json_delta') {
          toolCall += item.delta.partial_json;
        }
      } else if (item.type === 'message_delta') {
        usage = item.usage;
      } else if (item.type === 'content_block_start') {
        if (item.content_block.type === 'tool_use') {
          toolId = item.content_block.id;
          toolName = item.content_block.name;
        }
      } else if (item.type === 'content_block_stop') {
        if (toolId) {
          await cb(
            {
              id: toolId,
              name: toolName,
              args: JSON.parse(toolCall.trim()),
            },
            MessageType.Tools,
          );
          toolId = '';
          toolName = '';
          toolCall = '';
        }
      }
    }
    if (usage) await cb(usage, MessageType.Usage);
  };
};
