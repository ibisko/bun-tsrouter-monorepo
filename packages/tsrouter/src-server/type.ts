import type { FastifyBaseLogger, FastifyReply, FastifyRequest } from 'fastify';
import z, { ZodObject } from 'zod';
import type { MethodOptions } from '@/src-client/type';
import type { Func, IsPlainObject, MaybePromise } from '@packages/utils/types';
import type { RouterServer } from './core/RouterServer';

export type RegisterableProcedure<M extends Method = Method, T extends ZodObject | Func = any, R = any> = ProcedureDef<M, T, R> & {
  (rs: RouterServer, path: string[]): void;
};

export type ReplaceSpecificLeaf<T> = NonNullable<
  // todo $作为前一个路径的函数参数
  // prettier-ignore
  keyof T extends `$${string}`    ? Record<string, ReplaceSpecificLeaf<T[keyof T]>> :
  T extends ProcedureDef<infer M> ? { [K in Lowercase<M>]: NonNullable<T["func"]> } :
  IsPlainObject<T> extends true   ? { [K in keyof T]: ReplaceSpecificLeaf<T[K]> } :
                                    T
>;

export type RouterServerOptions = {
  formatLogger?: (request: FastifyRequest, reply: FastifyReply) => Record<string, unknown>;
};

// ========== 上下文 ==========

type LoggerErrorParam = {
  message: string;
  reason?: unknown;
  data?: Record<string, unknown>;
};
type ContextLogger = Record<Exclude<keyof FastifyBaseLogger, 'level' | 'msgPrefix'>, (param: LoggerErrorParam) => void> & {
  child: FastifyBaseLogger['child'];
};
export interface Context {
  reqId: string;
  query: Record<string, string>;
  url: string;
  ip: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  body: any;
  /** 日志 */
  logger: ContextLogger;
}

// ========== 基础的restApi方法 ===========

export type RestApiMethod = 'get' | 'post' | 'patch' | 'put' | 'delete';
// prettier-ignore
type StandardHandler<T, R> =
  T extends ZodObject ? (params: z.output<T>, options?: MethodOptions) => Promise<R>
                      : (parmas?: null, options?: MethodOptions) => Promise<R>;

// prettier-ignore
export type RestApiService<T extends ZodObject | null = null, R = any> =
  T extends ZodObject ? (param: z.output<T>, ctx: Context) => MaybePromise<R> :
                        (ctx: Context) => MaybePromise<R>;

export type MaybePromiseFunc = () => MaybePromise<void>;
type SseServiceResponse = {
  running: MaybePromiseFunc;
  disconnect?: MaybePromiseFunc;
  finish?: MaybePromiseFunc;
};

// =============== 基础和扩展方法 ===============

type Method = RestApiMethod | 'sse' | 'uploadFile';
type ProcedureDef<M extends Method, T extends ZodObject | Func = any, R = any> = {
  Method?: M;
  param?: z.output<T>;
  return?: R;
  // 单独条件区分，可扩展
  // todo uploadFile需要更完善些
  // prettier-ignore
  func?: 
    M extends 'sse'        ? SseHandler<T> :
    M extends 'uploadFile' ? (formData: FormData) => Promise<void> :
                             StandardHandler<T, R>;
};

// =============== 扩展方法SSE ===============

// prettier-ignore
type SseHandler<T> =
  T extends ZodObject ? (params: z.output<T>, options?: MethodOptions) => <K = any>(callback: (data: K) => void) => Promise<void>:
                        (parmas?: null, options?: MethodOptions) => <K = any>(callback: (data: K) => void) => Promise<void>;

/** sse写消息的方法 */
export type WriteFunc = {
  /** 默认 event 是 message */
  (data: string): Promise<void>;
  /** 自定义 event */
  (data: string, event: string): Promise<void>;
};

// prettier-ignore
export type SseService<T extends ZodObject | null = null> =
  T extends ZodObject ? (param: z.output<T>, optional: SseServiceOptional, ctx: Context) => Promise<SseServiceResponse | void> :
                        (optional: SseServiceOptional, ctx: Context) => Promise<SseServiceResponse | void>;

type SseServiceOptional = {
  write: WriteFunc;
  signal: AbortSignal;
};
