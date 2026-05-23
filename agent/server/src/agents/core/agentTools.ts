import { ToolKey } from '@/common/tools';
import { Anthropic, createTool, GPT } from '@packages/gpt';
import z from 'zod';

type ToolInfo = {
  description: string;
  schema: z.ZodType; // todo 转 parameters
  func: (param: any) => Promise<any>;
};

class AgentTools {
  tools: Map<string, ToolInfo> = new Map();

  set(key: ToolKey, value: ToolInfo) {
    return this.tools.set(key, value);
  }

  getToolsParameters(keys: ToolKey[], platform?: 'gpt'): GPT.Tool[];
  getToolsParameters(keys: ToolKey[], platform?: 'gemini'): { functionDeclarations: [] };
  getToolsParameters(keys: ToolKey[], platform?: 'anthropic'): Anthropic.Tool[];
  getToolsParameters(keys: ToolKey[], platform: string = 'gpt') {
    const tools = [];
    for (const key of keys) {
      const target = this.tools.get(key);
      if (!target) continue;
      tools.push(
        createTool({
          name: key,
          description: target.description,
          parameters: target.schema,
        }),
      );
    }

    if (platform === 'gpt') {
      return tools.map(item => ({
        type: 'function' as const,
        function: item,
      }));
    } else if (platform === 'gemini') {
      return {
        functionDeclarations: tools,
      };
    } else if (platform === 'anthropic') {
      return tools.map(item => ({
        name: item.name,
        description: item.description,
        input_schema: item.parameters,
      }));
    }
  }

  async execute<R = any>(kind: string, args: any): Promise<R | void> {
    const target = this.tools.get(kind);
    if (!target) return;

    const resparse = await z.safeParseAsync(target.schema, args);
    if (resparse.error) {
      throw new Error(z.prettifyError(resparse.error));
    }

    return await target.func(resparse.data);
  }
}

export default new AgentTools();
