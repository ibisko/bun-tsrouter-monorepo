import { cloneDeep, merge } from 'lodash-es';
import fastJson from 'fast-json-stringify';
import { parseToFastJsonStringify } from './utils';
import { MaybePromise } from 'bun';

const properties = parseToFastJsonStringify({
  lv: 'string',
  time: 'number',
  reqId: 'string',
  req: {
    method: 'string',
    url: 'string',
    ip: {
      address: 'string',
      family: 'string',
      port: 'string',
    },
  },
  step: 'string',
  func: 'string',
  msg: 'string',
  reason: 'string',
});

type LoggerOptions = {
  stdout?: Stdout;
};
type Stdout = (data: string) => MaybePromise<void>;

export class Logger {
  private _bindings?: any;
  private _this?: Logger;
  private stringify = fastJson({ type: 'object', properties });
  static reqId = 0;
  stdout: Stdout = console.log;

  constructor(options?: LoggerOptions) {
    if (options?.stdout) {
      this.stdout = options.stdout;
    }
  }

  private output(params: Record<string, any>) {
    if ('data' in params) {
      this.stdout(JSON.stringify(params));
    } else {
      this.stdout(this.stringify(params));
    }
  }

  private createLogger(lv: LoggerLevel, params?: LoggerErrorParam) {
    const defaultMeta = { time: new Date().getTime(), lv };
    if (this._bindings) {
      this._this!.output(merge(defaultMeta, this._bindings, params));
    } else {
      this.output(merge(defaultMeta, params));
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

type LoggerLevel = 'error' | 'warn' | 'info' | 'debug' | 'fatal' | 'silent' | 'trace';
type LoggerErrorParam = {
  step?: 'middleware' | 'validation' | 'service' | 'serviceAccident';
  func?: string;
  msg: string;
  /** 具体原因 */
  reason?: string;
  /** 挂载参数 */
  data?: Record<string, any>;
};
