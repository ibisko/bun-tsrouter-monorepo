import { pick } from 'lodash-es';
import { Context, Role } from './types';

export class ManageContext {
  private id = 1;

  context: Context[] = [];

  add(role: Role, content: string, insertIndex?: number) {
    const item: Context = {
      id: this.id,
      role,
      content,
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
        item.content = data;
      }
    };
  }

  // set(id: number, content: string) {
  //   this.context.find()
  // }

  delete(...ids: number[]) {
    const set = new Set(ids);
    this.context = this.context.filter(item => !set.has(item.id));
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
    item.content = content;
  }

  json() {
    return this.context.map(item => pick(item, 'content', 'role'));
  }
}
