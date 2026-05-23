import { GPT } from '@/types';
import { AddTool, createTool } from '@/utils';
import { Context, Gemini } from './types';
import { ManageContext } from './ManageContext';
import { cloneDeep, pick } from 'lodash-es';

/** 用于定义agent行为 */
export class ChatContext {
  private created = Date.now();
  system: string = '';

  /** 历史上下文 */
  context = new ManageContext();

  thinkingEvent = new EventTarget();
  contentEvent = new EventTarget();

  setSystem(content: string) {
    this.system = content;
  }

  jsonContext(): Context[] {
    const res = cloneDeep(this.context.context);
    if (this.system) {
      res.unshift({
        id: 0,
        created: this.created,
        role: GPT.Role.System,
        content: this.system,
      });
    }
    return res;
  }

  json(): { system: string; messages: GPT.Message[] } {
    return {
      system: this.system,
      messages: cloneDeep(this.context.json()) as GPT.Message[],
    };
  }

  toGemini() {
    const messages: Gemini.Content[] = this.context.context
      .filter(item => ['assistant', 'user'].includes(item.role))
      .map(item => {
        let role = item.role as Gemini.Role;
        if (item.role === 'assistant') {
          role = 'model';
        }
        if (typeof item.content === 'string') {
          return { role, parts: [{ text: item.content }] };
        }
        return {
          role,
          parts: item.content.map(item => pick(item, 'text')) as Gemini.Part[],
        };
      });
    return {
      system: this.system,
      messages,
    };
  }

  toAnthropic() {
    return {
      system: this.system,
      messages: this.context.json(),
    };
  }
}
