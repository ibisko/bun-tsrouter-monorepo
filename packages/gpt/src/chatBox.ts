import type { MaybePromise } from 'bun';
import type { GLM } from '@/types/glm';
import { AddTool, createTool } from '@/utils';
import { Context, Message, Tool } from './types';
import { ManageContext } from './ManageContext';
import { cloneDeep } from 'lodash-es';

type ChatContextParam = {
  system: string;
};

/** 用于定义agent行为 */
export class ChatContext<T> {
  private created = Date.now();
  system: string;
  tools: Tool[] = [];

  /** 历史上下文 */
  context = new ManageContext();

  thinkingEvent = new EventTarget();
  contentEvent = new EventTarget();

  /**
   * todo
   * 初始的 system
   *
   */
  constructor({ system }: ChatContextParam) {
    this.system = system;
  }

  setSystem(content: string) {
    this.system = content;
  }

  /** 添加工具 */
  addTools({ name, description, parameters }: AddTool) {
    const tool = createTool({ name, description, parameters });
    this.tools.push(tool);
  }

  private request: (param: GLM.GlmRequestParam, cb: Callback) => Promise<any> = async () => {};
  bindRequest(cb: (param: GLM.GlmRequestParam, cb: Callback) => Promise<any>) {
    this.request = cb;
  }
  private messageCallback: Callback = () => {};
  bindMessage(cb: Callback) {
    this.messageCallback = cb;
  }
  /** agent 主动询问用户 */
  bindAgentRequest(cb: () => void) {}

  /** 用户添加会话消息 */
  async sendMessage(message: string) {
    this.context.add('user', message);

    const res = await this.request(
      {
        messages: this.context.json(),
        tools: this.tools,
      },
      this.messageCallback,
    );

    // todo 工具调用循环反馈
    // todo 工具激活调用
    const toolsCallback: {
      role: 'tool'; // 角色必須是 tool
      tool_call_id: string; // 必須與上面的 id 一致
      content: string;
    }[] = [];
    const tools = res.choicesToolCalls as GLM.ChoicesToolCalls[];
    for (const item of tools) {
      console.log(item.id, item.index, item.function.name);
      console.log(JSON.parse(item.function.arguments));
    }
  }

  jsonContext(): Context[] {
    return cloneDeep([
      {
        id: 0,
        role: 'system',
        created: this.created,
        content: this.system,
      },
      ...this.context.context,
    ]);
  }

  json(): Message[] {
    return cloneDeep([
      {
        role: 'system',
        content: this.system,
      },
      ...this.context.json(),
    ]);
  }
}

type Callback = (text: string, type: 'thinking' | 'content') => MaybePromise<void>;
