import z from 'zod';

export namespace Anthropic {
  export type Message = { role: 'user' | 'assistant'; content: Content[] };

  export type Tool = {
    type?: 'custom';
    name: string;
    description: string;
    input_schema: {
      type: string;
      properties: string;
      required: string[];
    };
  };

  // =========== Response ============

  /** 内容块增量（逐步输出） */
  interface ContentBlockDeltaEvent {
    type: 'content_block_delta';
    index: number;
    delta:
      | {
          type: 'thinking_delta';
          thinking: string;
        }
      | { type: 'text_delta'; text: string }
      | { type: 'input_json_delta'; partial_json: string };
  }

  export type Usage = {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens: number;
    server_tool_use: {
      web_search_requests: number;
    };
    service_tier: string;
  };

  /** 消息结束：包含 token 用量统计 */
  interface MessageDeltaEvent {
    type: 'message_delta';
    delta: {
      stop_reason: string | null; // "end_turn" | null
      stop_sequence: number | null;
    };
    usage: Usage;
  }

  interface ContentBlockStart {
    type: 'content_block_start';
    index: number;
    content_block:
      | {
          type: 'tool_result';
          tool_use_id: string;
          content: string;
        }
      | {
          type: 'tool_use';
          id: string;
          name: string;
          input: {};
        };
  }

  type Ping = { type: 'ping' };

  type ContentBlockStop = { type: 'content_block_stop'; index: number };

  export type StreamResponse = Ping | MessageDeltaEvent | ContentBlockStart | ContentBlockDeltaEvent | ContentBlockStop;
}

type Content = ContentText | ContentImage | ContentToolUse | ContentToolResult | ContentThinking;

type ContentText = { type: 'text'; text: string };
type ContentImage = {
  type: 'image';
  source:
    | {
        type: 'url';
        url: string;
      }
    | {
        type: 'base64';
        media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'image/bmp';
        data: string;
      };
};

type ContentToolUse = {
  type: 'tool_use';
  id: string;
  input: {};
  name: string;
};

type ContentToolResult = {
  type: 'tool_result';
  tool_use_id: string;
  is_error: boolean;
  content: string[] | ContentText[] | ContentImage[];
};

type ContentThinking = {
  type: 'thinking';
  signature: string;
  thinking: string;
};

export const anthropicRequestSchema = z.object({
  model: z.string(),
  messages: z.array(z.any()),
  system: z.string(),
  thinking: z.boolean().optional(),
  tools: z.array(z.any()).optional(),
  max_tokens: z.number().optional().default(128000),
  temperature: z.number().optional(),
});

/*

text
tool_use
tool_result
advisor_tool_result

image
server_tool_use
web_search_tool_result
search_result
document
thinking
redacted_thinking
code_execution_tool_result
mcp_tool_use
mcp_tool_result
container_upload
web_fetch_tool_result
bash_code_execution_tool_result
text_editor_code_execution_tool_result
tool_search_tool_result
compaction

*/
