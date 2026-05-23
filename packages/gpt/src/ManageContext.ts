import { pick } from 'lodash-es';
import { Context, GPT } from './types';

export class ManageContext {
  private id = 1;

  context: Context[] = [];

  add(role: GPT.Role, content: string, insertIndex?: number) {
    const item: any = {
      id: this.id,
      role,
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
      created: Date.now(),
    };
    this.id++;

    if (insertIndex !== undefined) {
      this.context.splice(insertIndex, 0, item);
    } else {
      this.context.push(item);
    }

    return (data: string, isThinking?: boolean) => {
      if (isThinking) {
        item.thinking = data;
      } else {
        item.content = [{ type: 'text', text: data }];
      }
    };
  }

  // todo 修改
  // set(id: number, content: string) {
  //   this.context.find()
  // }

  delete(...ids: number[]) {
    const set = new Set(ids);
    this.context = this.context.filter(item => !set.has(item.id));
  }

  truncateFrom(id: number) {
    const context = [];
    for (const item of this.context) {
      context.push(item);
      if (item.id === id) break;
    }
    this.context = context;
  }

  sort(...ids: number[]) {
    const _context: Context[] = [];
    const map = new Map(this.context.map(item => [item.id, item]));
    for (const id of ids) {
      if (!map.has(id)) continue;
      _context.push(map.get(id)!);
    }
    this.context = _context;
  }

  change(id: number, content: string) {
    const item = this.context.find(item => item.id === id);
    if (!item) return;
    item.content = [{ type: 'text', text: content }];
  }

  json() {
    return this.context.map(item => pick(item, 'content', 'role'));
  }
}
