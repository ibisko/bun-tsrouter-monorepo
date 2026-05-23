/**
 * 用户意图
 * loop是直到任务完成
 *
 * todo:
 * - 支持随时添加 user message
 *   - 追加的 user message pid 就是上一个 user message 的 id
 *   - 思考“任何沟通一定要有其之规”这是不是没有规，意图揣摩太模糊了，那就需要询问确认吧
 *   - tool call 未执行完毕，就不入库，这样能避免执行中途挂掉，后面又要恢复的麻烦
 *     - 执行完毕再入库，执行过程中添加的 user message 进行合并
 * - write 回传状态消息
 *
 */

import { GPT } from '@packages/gpt';
import { ToolKey } from '@/common/tools';
import { LlmHandleCallbackParam } from '../core/llm';
import path from 'path';
import { BaseAgent } from '../core/baseAgent';
import { AgentSession, SourceItem } from '../core/agentSession';
import { ToolCall } from '../ToolCall';

export class UserIntent extends BaseAgent {
  protected agentType = 'USER_INTENT';
  protected tools: ToolKey[] = [];

  protected async llmHandleCallback({ content, tools }: LlmHandleCallbackParam) {
    const toolResults: GPT.ToolResult[] = await this.executeTool(tools);

    if (content) {
      console.log('OOOO-content:', content);
      let contentObj;
      try {
        contentObj = JSON.parse(content.trim());
      } catch {
        console.log('格式化错误', content);
        return;
      }
      if (contentObj.type === 'clear') {
        contentObj.query;
        const tc = new ToolCall(this.agentSession!);
        await tc.call({ text: contentObj.query });
      }
    }

    return toolResults;
  }

  async sendMessage({ text, sources, pid, sessionId }: UserIntentSendMessage) {
    const system = await Bun.file(path.join(__dirname, 'prompt.md')).text();

    if (pid) {
      this.agentSession = new AgentSession();
      await this.agentSession.splitByPid({ pid, text, sources });
    } else if (sessionId) {
      this.agentSession = new AgentSession();
      await this.agentSession.supplementary({ text, sources, sessionId });
    } else {
      this.agentSession = new AgentSession();
      await this.agentSession.createSession({ text, sources });
    }

    await this.llm({ system, messages: this.agentSession.messages });
    this.agentSession.end();
  }
}

type UserIntentSendMessage = {
  sessionId?: number;
  pid?: number; // 用于指定从哪个 id 开始切分支
  text: string;
  sources?: SourceItem[];
};
