import { MaybePromise } from 'bun';
import { GPT } from '@/types';

export const gptParseStreamJson = (streamJson: GPT.StreamResponse[], cb: Callback) => {
  let usage: GPT.Usage | undefined = undefined;
  let reasoning_content = '';
  let content = '';
  const tool_calls: GPT.ChoicesToolCalls[] = [];

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
