import z from 'zod';

export namespace GPT {
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

  export type Tool = {
    type: 'function';
    function: {
      name: string;
      description: string;
      /** JSON Schema 格式，用 zod */
      parameters: any;
    };
  };

  export type Message = z.output<typeof gptRequestSchema>['messages'][number];
  export type Role = Message['role'];
  export type Content = Message['content'];

  export type RequestParam = {
    model?: string;
    messages: Message[];
    tools?: Tool[];
    temperature?: number;
  };
}

const gptRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['assistant', 'user', 'system', 'tool']),
      content: z.array(
        z.object({
          type: z.enum(['file_url', 'image_url', 'video_url', 'text']),
          text: z.string(),
          file_url: z.object({ url: z.string() }).optional(),
          image_url: z.object({ url: z.string() }).optional(),
          video_url: z.object({ url: z.string() }).optional(),
        }),
      ),
    }),
  ),
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

export const glmRequestSchema = gptRequestSchema.extend({
  model: z.enum(['glm-5.1', 'glm-5-turbo', 'glm-4.7', 'glm-4.6v', 'glm-4.5', 'glm-4.5-air']).default('glm-5.1').optional(),
});
export const deepseekRequestSchema = gptRequestSchema.extend({
  model: z.enum(['deepseek-reasoner']).default('deepseek-reasoner').optional(),
});
export const kimiRequestSchema = gptRequestSchema.extend({
  model: z.enum(['kimi-k2.5']).default('kimi-k2.5').optional(),
});
