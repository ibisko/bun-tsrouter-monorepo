import path from 'path';
import { ToolKey } from '@/common/tools';
import { BaseAgent } from '../core/baseAgent';
import { GPT } from '@packages/gpt';
import { LlmHandleCallbackParam } from '../core/llm';
import { AgentSession, SourceItem } from '../core/agentSession';

export class ToolCall extends BaseAgent {
  protected agentType = 'TOOL_CALL';
  protected tools: ToolKey[] = [ToolKey.WebSearch];
  protected agentSession: AgentSession;

  constructor(agentSession: AgentSession) {
    super();
    this.agentSession = agentSession;
  }

  protected async llmHandleCallback({ tools }: LlmHandleCallbackParam) {
    const toolResults: GPT.ToolResult[] = await this.executeTool(tools);
    console.log('toolResults', toolResults);
    return toolResults;
  }

  async call({ text, sources }: CallParams) {
    const system = await Bun.file(path.join(__dirname, 'prompt.md')).text();
    system.replace('<|CURRENT_TIME|>', new Date().toString());

    await this.agentSession.append({
      role: GPT.Role.User,
      content: [{ type: 'text', text }],
      agent_type: this.agentType,
    });

    await this.llm({ system, messages: this.agentSession.messages });
  }
}

type CallParams = {
  text: string;
  sources?: SourceItem[];
};
