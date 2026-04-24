import type { Logger } from './logger';
import { MaybePromise } from 'bun';
import type { RestApiMethod } from '@/types';

export interface Context {
  url: string;
  ip: Bun.SocketAddress | null;
  headers: Headers;
  resHeaders: Headers;
  params: Record<string, string>;
  body: Bun.BunRequest['body'];
  /** 日志 */
  logger: Logger;
}

// =============== 扩展方法SSE ===============

type RS = (logger: Logger, middlewares: Middleware[]) => void;

export interface ServiceClass {
  method: RestApiMethod;
  set(...args: unknown[]): RS;
}

// todo next()
export type Middleware = (request: Bun.BunRequest, ctx: Context) => MaybePromise<unknown>;

export type UploadFileService = (formData: FormData, ctx: Context) => MaybePromise<any>;
