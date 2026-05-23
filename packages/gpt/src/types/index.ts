export { type Gemini, geminiRequestSchema, geminiModel } from '@/types/gemini';
export { type Anthropic, anthropicRequestSchema } from '@/types/anthropic';
export { GPT, gptRequestSchema } from '@/types/gpt';
import { type GPT } from '@/types/gpt';
import type { MaybePromise } from 'bun';

export type Context = GPT.Message & {
  id: number;
  created: number;
  thinking?: string;
};

export type SseCallback = (data: any, type: MessageType) => MaybePromise<void>;

export enum MessageType {
  Content = 'Content',
  Thinking = 'Thinking',
  // CompleteContent = 'CompleteContent',
  Usage = 'Usage',
  Tools = 'Tools',
}

export type ToolCall = {
  id: string;
  name: string;
  args: any;
};
