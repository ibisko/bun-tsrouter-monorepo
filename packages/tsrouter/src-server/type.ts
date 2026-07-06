import type { Logger } from './logger';
import { MaybePromise } from 'bun';
import { RestApiMethod } from '@packages/utils';

export interface Context {
  url: string;
  ip: Bun.SocketAddress | null;
  headers: Headers;
  resHeaders: Headers;
  params: Record<string, string | undefined>;
  body: Bun.BunRequest['body'];
  /** 日志 */
  logger: Logger;
}

/** 在 createRouter 中设置上下文 */
export type RouterSetup = (path: string, logger: Logger, middlewares: Middleware[], optionsService: BunServeHandler) => void;

export type BunServeHandler = Bun.Serve.Handler<Bun.BunRequest, Bun.Server<undefined>, unknown>;

// =============== 扩展方法SSE ===============

export interface ServiceClass {
  method: RestApiMethod;
  set(...args: unknown[]): RouterSetup;
}

// todo next()
export type Middleware = (request: Bun.BunRequest, ctx: Context) => MaybePromise<unknown>;

export type PostFormDataService = (formData: FormData, ctx: Context) => MaybePromise<any>;

export type PutFileService = (readableStream: ReadableStream<Uint8Array<ArrayBuffer>>, ctx: Context) => MaybePromise<any>;
