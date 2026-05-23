import z, { boolean } from 'zod';

export namespace GPT {
  export enum Role {
    User = 'user',
    Assistant = 'assistant',
    Tool = 'tool',
    System = 'system',
  }
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
      tool_calls?: ToolCall[];
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

  /** 请求时定义的 tool */
  export type Tool = {
    type: 'function';
    function: {
      name: string;
      description: string;
      /** JSON Schema 格式，用 zod */
      parameters: any;
    };
  };

  /** LLM 响应中需要调用的 tool */
  export type ToolCall = {
    id: string;
    index: number;
    type: 'function';
    function: {
      name: string;
      arguments: string; // JSON string
    };
  };

  /** Tool 执行完成后返回的结果 */
  export type ToolResult = {
    tool_call_id: string;
    role: Role.Tool;
    content: string;
  };

  // ============== message ==============
  type ToolSystem = {
    role: Role.System;
    content: string;
  };

  type MessageAssistant = {
    role: Role.Assistant;
    content: string;
  };

  type MessageUserContentText = { type: 'text'; text: string };
  type MessageUserContentFile = { type: 'file_url'; file_url: { url: string } };
  type MessageUserContentImage = { type: 'image_url'; image_url: { url: string } };
  type MessageUserContentVideo = { type: 'video_url'; video_url: { url: string } };
  export type MessageUserContent = MessageUserContentText | MessageUserContentFile | MessageUserContentImage | MessageUserContentVideo;
  // export type MessageUserContent = z.output<typeof gptUserMessageContentSchema>;
  type MessageUser = {
    role: Role.User;
    content: MessageUserContent[];
  };

  export type Message = MessageUser | MessageAssistant | ToolResult | ToolSystem;

  export type Content = Message['content'];

  export type RequestParam = {
    model?: string;
    system?: string;
    messages: Message[];
    tools?: Tool[];
    temperature?: number;
    thinking?: boolean;
    jsonFormat?: boolean;
  };

  export type BaseRequestSchemaType = z.output<typeof gptRequestSchema>;
}

/* export const gptUserMessageContentSchema = z.array(
  z.union([
    z.object({ type: z.literal(['text']), text: z.string() }),
    z.object({ type: z.literal('file_url'), file_url: z.object({ url: z.string() }) }),
    z.object({ type: z.literal('image_url'), image_url: z.object({ url: z.string() }) }),
    z.object({ type: z.literal('video_url'), video_url: z.object({ url: z.string() }) }),
  ]),
); */

export const gptRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['assistant', 'user', 'system', 'tool']),
      tool_call_id: z.string().optional(),
      content: z
        .array(
          z.object({
            type: z.enum(['file_url', 'image_url', 'video_url', 'text']),
            text: z.string().optional(),
            file_url: z.object({ url: z.string() }).optional(),
            image_url: z.object({ url: z.string() }).optional(),
            video_url: z.object({ url: z.string() }).optional(),
          }),
        )
        .or(z.string()),
    }),
  ),
  model: z.string().optional(),
  system: z.string().optional(),
  tools: z.array(z.any()).optional(),
  temperature: z.number().optional(),
  thinking: z.boolean().optional(),
  jsonFormat: z.boolean().optional(),
});
