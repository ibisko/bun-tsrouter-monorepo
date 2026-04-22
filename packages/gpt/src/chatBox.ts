import type { MaybePromise } from 'bun';
import type { GPT } from '@/types';
import { AddTool, createTool } from '@/utils';
import { Context, Gemini } from './types';
import { ManageContext } from './ManageContext';
import { cloneDeep, pick } from 'lodash-es';

/** 用于定义agent行为 */
export class ChatContext<T> {
  private created = Date.now();
  system: string = '';
  tools: GPT.Tool[] = [];

  /** 历史上下文 */
  context = new ManageContext();

  thinkingEvent = new EventTarget();
  contentEvent = new EventTarget();

  /**
   * todo
   * 初始的 system
   *
   */
  constructor() {}

  setSystem(content: string) {
    this.system = content;
  }

  /** 添加工具 */
  addTools({ name, description, parameters }: AddTool) {
    const tool = createTool({ name, description, parameters });
    this.tools.push(tool);
  }

  jsonContext(): Context[] {
    const res = cloneDeep(this.context.context);
    if (this.system) {
      res.unshift({
        id: 0,
        created: this.created,
        role: 'system',
        content: [{ type: 'text', text: this.system }],
      });
    }
    return res;
  }

  json(): GPT.Message[] {
    const res = cloneDeep(this.context.json());
    if (this.system) {
      res.unshift({
        role: 'system',
        content: [{ type: 'text', text: this.system }],
      });
    }
    return res;
  }

  toGemini() {
    const contents: Gemini.Content[] = this.context.context
      .filter(item => ['assistant', 'user'].includes(item.role))
      .map(item => {
        let role = item.role as Gemini.Role;
        if (item.role === 'assistant') {
          role = 'model';
        }
        if (typeof item.content === 'string') {
          return { role, parts: [{ text: item.content }] };
        }
        return { role, parts: item.content.map(item => pick(item, 'text')) };
      });
    return {
      systemInstruction: { parts: [{ text: this.system }] },
      contents,
    };
  }
}
