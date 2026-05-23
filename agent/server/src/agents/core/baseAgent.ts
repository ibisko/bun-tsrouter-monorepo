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

import { GPT, ToolCall } from '@packages/gpt';
import { ToolKey } from '@/common/tools';
import { llmHandle, LlmHandleCallbackParam } from './llm';
import agentTools from './agentTools';
import { AgentSession } from './agentSession';

export abstract class BaseAgent {
  private writerFuncs = new Set<(param: any, event?: string) => Promise<void>>();
  protected agentSession: AgentSession | null = null;

  private abortController = new AbortController();

  protected abstract agentType: string;
  protected abstract tools: ToolKey[];

  public addWriteListener(write: (param: any, event?: string) => Promise<void>, signal: AbortSignal) {
    this.writerFuncs.add(write);
    signal.addEventListener('abort', () => this.writerFuncs.delete(write), { once: true });
  }

  protected emit(param: any, event?: string) {
    // this.agentSession?.sessionId
    this.writerFuncs.forEach(fn => fn(param, event).catch(() => {}));
  }

  protected abstract llmHandleCallback(params: LlmHandleCallbackParam): Promise<GPT.Message[] | void>;

  protected async llm({ system, messages }: { system: string; messages: GPT.Message[] }) {
    const tools = agentTools.getToolsParameters(this.tools);
    await llmHandle({
      system,
      messages,
      tools,
      signal: this.abortController.signal,
      writeEvent: (...args) => this.emit(...args),
      callback: (...args) => this.llmHandleCallback(...args),
    });
  }

  public abort() {
    this.abortController.abort();
  }

  protected async executeTool(tools: ToolCall[]) {
    const toolResults: GPT.ToolResult[] = [];
    for (const tool of tools) {
      console.log('->tool', tool);

      try {
        const res = await agentTools.execute(tool.name, tool.args);
        console.log(res);

        await this.agentSession?.append({
          role: GPT.Role.Tool,
          content: res.content,
          metadata: res.metadata,
          agent_type: this.agentType,
        });

        const toolResult: GPT.ToolResult = {
          role: GPT.Role.Tool,
          tool_call_id: tool.id,
          content: res.content,
        };

        toolResults.push(toolResult);
      } catch (error) {
        // todo 日志记录
        console.log(error);
      }
    }

    return toolResults;
  }
}
