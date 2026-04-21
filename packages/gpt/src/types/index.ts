export type Role = 'assistant' | 'user' | 'system' | 'tool';

export type Tool = {
  type: 'function';
  function: {
    name: string;
    description: string;
    /** JSON Schema 格式，用 zod */
    parameters: any;
  };
};

export type Message = {
  role: Role;
  content: string;
  tool_call_id?: string;
};

export type Context = Message & {
  id: number;
  created: number;
  thinking?: string
};
