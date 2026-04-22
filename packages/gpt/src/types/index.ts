export { type Gemini, geminiRequestSchema } from '@/types/gemini';
export { type GPT, glmRequestSchema, deepseekRequestSchema, kimiRequestSchema } from '@/types/gpt';
import { type GPT } from '@/types/gpt';

export type Role = GPT.Role;

export type Context = GPT.Message & {
  id: number;
  created: number;
  thinking?: string;
};
