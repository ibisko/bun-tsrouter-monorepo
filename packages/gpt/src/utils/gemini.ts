import { MaybePromise } from 'bun';
import { Gemini } from '@/types/gemini';

// data: {"candidates": [{"content": {"parts": [{"text": "**凯蒂猫（Hello Kitty）** 是"}],"role": "model"},"index": 0}],"usageMetadata": {"promptTokenCount": 5,"candidatesTokenCount": 10,"totalTokenCount": 612,"promptTokensDetails": [{"modality": "TEXT","tokenCount": 5}],"thoughtsTokenCount": 597},"modelVersion": "gemini-3-flash-preview","responseId": "g6bnaYSOCJSxjuMPuJSl0Ao"}

export const geminiParseStreamJson = (streamJson: Gemini.StreamResponse[], cb: Callback) => {
  let usage: Gemini.UsageMetadata | undefined = undefined;
  let thought = '';
  let content = '';
  // const tool_calls: Gemini.ChoicesToolCalls[] = [];

  for (const item of streamJson) {
    for (const candidate of item.candidates) {
      for (const part of candidate.content.parts) {
        if (part.thought) {
          thought += part.text;
        } else {
          content += part.text;
        }
      }
      // if (chiocs.delta.tool_calls) {
      //   tool_calls.push(...chiocs.delta.tool_calls);
      // }
    }
    if (item.usageMetadata) {
      usage = item.usageMetadata;
    }
  }

  if (thought) {
    cb(thought, 'thinking');
  }

  if (content) {
    cb(content, 'content');
  }

  return {
    usage,
    // tool_calls
  };
};

type Callback = (data: string, type: 'thinking' | 'content') => MaybePromise<void>;
