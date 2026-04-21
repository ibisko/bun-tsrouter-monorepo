import z from 'zod';
import { Role, Tool } from '.';

export namespace GLM {
  export type StreamResponse = {
    id: string;
    created: number; // 1772685335
    object: string; // chat.completion.chunk
    model: string; // "glm-5.1";
    choices: Choices[];
    usage?: Usage;
  };

  export type Choices = {
    index: number;
    delta: {
      role: string; // assistant
      /** 思考内容 */
      reasoning_content?: string;
      /** 正式输出内容 */
      content?: string;
      /** 工具调用 */
      tool_calls?: ChoicesToolCalls[];
    };
    /** "stop" */
    finish_reason?: string;
  };

  export type Usage = {
    /** 输入（提示词）消耗的 token 数 */
    prompt_tokens: number;
    /** 模型输出消耗的 token 数 */
    completion_tokens: number;
    /** 本次请求消耗的总 token 数（prompt_tokens + completion_tokens） */
    total_tokens: number;
    prompt_tokens_details: {
      /** 命中缓存的 token 数 */
      cached_tokens: number;
    };
    completion_tokens_details: {
      /** 思考/推理过程消耗的 token 数 */
      reasoning_tokens: number;
    };
  };

  export type ChoicesToolCalls = {
    id: string;
    index: number;
    type: 'function';
    function: {
      name: string;
      arguments: string; // '{"filePath":["src/main.ts"]}';
    };
  };

  // ============================================================

  export type GlmRequestParam = {
    model?: string;
    messages: any[];
    tools?: Tool[];
    temperature?: number;
  };
}

export const glmRequestSchema = z.object({
  model: z.enum(['glm-5.1', 'glm-5-turbo', 'glm-4.5-air']).default('glm-5.1').optional(),
  messages: z.array(z.any()),
  tools: z.array(z.any()).optional(),
  temperature: z.number().optional(),
  thinking: z
    .object({
      type: z.enum(['enabled', 'disabled']),
    })
    .optional(),
  response_format: z
    .object({
      type: z.enum(['json_object', 'text']),
    })
    .optional(),
});
