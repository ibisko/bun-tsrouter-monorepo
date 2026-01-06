import z from 'zod';
import type { MethodOptions } from '@/src-client/type';
import type { Func, IsPlainObject, MaybePromise } from '@packages/utils/types';
import type { Logger } from './logger';

/** 用于 clinet 的 AppRouter */
export type ReplaceSpecificLeaf<T> = NonNullable<
  // todo $作为前一个路径的函数参数
  // prettier-ignore
  keyof T extends `$${string}`    ? Record<string, ReplaceSpecificLeaf<T[keyof T]>> :
  T extends ProcedureDef<infer M> ? { [K in M]: NonNullable<T["func"]> } :
  IsPlainObject<T> extends true   ? { [K in keyof T]: ReplaceSpecificLeaf<T[K]> } :
                                    T
>;

export interface Context {
  url: string;
  // ip: string;
  ip: Bun.SocketAddress | null;
  headers: Bun.BunRequest['headers'];
  resHeaders: Headers;
  params: Record<string, string>;
  body: Bun.BunRequest['body'];
  /** 日志 */
  logger: Logger;
}

// ========== 基础的restApi方法 ===========

export type RestApiMethod = 'get' | 'post' | 'patch' | 'put' | 'delete';
// prettier-ignore
type StandardHandler<T, R> =
  T extends z.ZodObject ? (params: z.output<T>, options?: MethodOptions) => Promise<R>
                        : (parmas?: null, options?: MethodOptions) => Promise<R>;

// =============== 基础和扩展方法 ===============

export type Method = RestApiMethod | 'sse' | 'uploadFile';

export type ProcedureDef<M extends Method, T extends z.ZodObject | Func = any, R = any> = {
  Method?: M;
  param?: T extends z.ZodObject ? z.output<T> : null;
  return?: R;
  // 单独条件区分，可扩展
  // todo uploadFile需要更完善些
  // prettier-ignore
  func?:
    M extends 'sse'         ? SseHandler<T> :
    M extends 'uploadFile'  ? (formData: FormData) => Promise<void> :
    M extends RestApiMethod ? StandardHandler<T, R> :
                              never;
};

// =============== 扩展方法SSE ===============

// prettier-ignore
type SseHandler<T> =
  T extends z.ZodObject ? (params: z.output<T>, options?: MethodOptions) => <K = any>(callback: (data: K) => void) => Promise<void>:
                          (parmas?: null, options?: MethodOptions) => <K = any>(callback: (data: K) => void) => Promise<void>;

/** sse写消息的方法 */
export type WriteFunc = {
  /** 默认 event 是 message */
  (data: string): Promise<void>;
  /** 自定义 event */
  (data: string, event: string): Promise<void>;
};

// prettier-ignore
export type SseService<T extends z.ZodObject | null = null> =
  T extends z.ZodObject ? (param: z.output<T>, optional: SseServiceOptional) => MaybePromise<void> :
                          (optional: SseServiceOptional) => MaybePromise<void>;

type SseServiceOptional = {
  write: WriteFunc;
  signal: AbortSignal;
  ctx: Context;
};

export type RS = (logger: Logger, middlewares: Middleware[]) => void;

export interface ServiceClass {
  method: RestApiMethod;
  set(...args: unknown[]): RS;
}

// todo next()
export type Middleware = (request: Bun.BunRequest, ctx: Context) => MaybePromise<unknown>;

export type UploadFileService = (formData: FormData, ctx: Context) => MaybePromise<any>;
