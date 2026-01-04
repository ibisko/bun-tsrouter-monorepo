import fs from 'fs';
import { cloneDeep, merge } from 'lodash-es';
import fastJson from 'fast-json-stringify';
import path from 'path';

export class Logger {
  private _bindings?: any;
  private _this?: Logger;
  _cache: any[] = [];
  private writeStream: fs.WriteStream;
  private stringify: (params: any) => string;
  static reqId = 0;

  constructor({ mainFilename, dirPath }: LoggerOptional) {
    this.writeStream = fs.createWriteStream(path.join(dirPath, mainFilename || 'main.log'), {
      // 日志通常是小而频繁的写入，小缓冲区减少内存占用
      highWaterMark: 1024 * 4, // 4kb
      encoding: 'utf8',
      flags: 'a',
    });

    const properties: { [key: string]: { type: 'string' | 'number' | 'object'; properties?: {} } } = {
      lv: { type: 'string' },
      time: { type: 'number' },
      reqId: { type: 'string' },
      req: {
        type: 'object',
        properties: {
          method: { type: 'string' },
          url: { type: 'string' },
          ip: {
            type: 'object',
            properties: {
              address: { type: 'string' },
              family: { type: 'string' },
              port: { type: 'string' },
            },
          },
        },
      },

      step: { type: 'string' },
      func: { type: 'string' },
      msg: { type: 'string' },
      reason: { type: 'string' },
      // data 如果存在就不会走这里
    };

    this.stringify = fastJson({ type: 'object', properties });
  }

  private async asyncWrite(): Promise<void> {
    let data = '';
    while (this._cache.length) {
      const item = this._cache.shift();
      // 默认采用 fast-json-stringify 来加速
      if (item.data) {
        data += JSON.stringify(item) + '\n';
      }
      // 当存在data时候，才回退到 JSON.stringify
      else {
        data += this.stringify(item) + '\n';
      }
    }
    // 批量写入
    await new Promise((resolve, reject) =>
      this.writeStream.write(data, err => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      }),
    );
    // todo 日志体积、时间间隔（每天，占用空间）
    if (this._cache.length) {
      return this.asyncWrite();
    }
  }

  private isWriting = false;
  private async push(params: Record<string, any>) {
    this._cache.push(params);
    if (this.isWriting) return;
    this.isWriting = true;
    await this.asyncWrite();
    this.isWriting = false;
  }

  private createLogger(lv: LoggerLevel, params?: LoggerErrorParam) {
    const defaultMeta = { time: new Date().getTime(), lv };
    if (this._bindings) {
      this._this!.push(merge(defaultMeta, this._bindings, params));
    } else {
      this.push(merge(defaultMeta, params));
    }
  }

  child(params: Record<string, any>) {
    const child = Object.create(this) as Logger; // 用于创建一个新的原型
    child._this = this._this || this;
    child._bindings = child._bindings ? merge(child._bindings, cloneDeep(params)) : cloneDeep(params);
    return child;
  }

  info(params?: LoggerErrorParam) {
    return this.createLogger('info', cloneDeep(params));
  }
  warn(params?: LoggerErrorParam) {
    return this.createLogger('warn', cloneDeep(params));
  }
  error(params?: LoggerErrorParam) {
    return this.createLogger('error', cloneDeep(params));
  }
  debug(params?: LoggerErrorParam) {
    return this.createLogger('debug', cloneDeep(params));
  }
  fatal(params?: LoggerErrorParam) {
    return this.createLogger('fatal', cloneDeep(params));
  }
  silent(params?: LoggerErrorParam) {
    return this.createLogger('silent', cloneDeep(params));
  }
  trace(params?: LoggerErrorParam) {
    return this.createLogger('trace', cloneDeep(params));
  }
}
type LoggerOptional = {
  dirPath: string;
  mainFilename?: string;
};
type LoggerLevel = 'error' | 'warn' | 'info' | 'debug' | 'fatal' | 'silent' | 'trace';
type LoggerErrorParam = {
  step: 'middleware' | 'validation' | 'service' | 'serviceAccident';
  func?: string;
  msg: string;
  /** 具体原因 */
  reason?: string;
  /** 挂载参数 */
  data?: Record<string, any>;
};

// todo 写入基准测试，每秒 20万+ 条日志写入
/* const lg = new Logger({
  dirPath: '/Users/nnhu/Projects/base-project-templates/template-monorepo/apps/bun-server/src',
});
for (let i = 0; i < 10; i++) {
  // await sleep(1);
  lg.child({ name: 'aa', b1: 'AAA' })
    .child({ a1: '1' })
    .child({
      b1: '1',
      name: '12121',
      param: {
        child: { aa: 1 },
      },
    })
    .info({ msg: 'haha', data: { id: 1, name: 32 } });
  lg.info({ msg: 'jflk' });
} */
