import z, { ZodObject } from 'zod';
import { RouterServer } from './core';
import type { MethodOptions } from '@/src-client/type';
import type { FastifyBaseLogger, FastifyReply, FastifyRequest } from 'fastify';

export type WriteFunc = {
  /** 默认 event 是 message */
  (data: string): void;
  /** 自定义 event */
  (data: string, event: string): void;
};

export type Method = 'get' | 'post' | 'sse' | 'patch' | 'put' | 'delete';

type SseHandler<T> = T extends ZodObject
  ? (params: z.output<T>, options?: MethodOptions) => <K = any>(callback: (data: K) => void) => Promise<void>
  : (options?: MethodOptions) => <K = any>(callback: (data: K) => void) => Promise<void>;

type StandardHandler<T, R> = T extends ZodObject
  ? (params: z.output<T>, options?: MethodOptions) => Promise<R>
  : (options?: MethodOptions) => Promise<R>;

type ProcedureDef<M extends Method, T extends ZodObject | Function = any, R = any> = {
  Method?: M;
  param?: z.output<T>;
  return?: R;
  func?: Lowercase<M> extends `${string}sse` ? SseHandler<T> : StandardHandler<T, R>;
};

export type RegisterableProcedure<
  M extends Method = Method,
  T extends ZodObject | Function = any,
  R = any,
> = ProcedureDef<M, T, R> & {
  (rs: RouterServer, path: string[]): void;
};

// prettier-ignore
export type ReplaceSpecificLeaf<T> = NonNullable<
  keyof T extends `$${string}`    ? Record<string, ReplaceSpecificLeaf<T[keyof T]>> :
  T extends ProcedureDef<infer M> ? { [K in Lowercase<M>]: NonNullable<T["func"]> } :
  IsPlainObject<T> extends true   ? { [K in keyof T]: ReplaceSpecificLeaf<T[K]> } : T
>;

// 判断是否为 普通对象, 排除数组/函数/基本数据类型
type IsPlainObject<T> = T extends object ? (T extends readonly any[] ? false : true) : false;

export type RestApiBaseParam = {
  path: string | string[];
  zodSchema?: ZodObject;
  service: (param: any, optional?: any) => Promise<any>;
};

export type Context<T = {}> = T & {
  query: Record<string, string>;
  url: string;
  ip: string;
  params: Record<string, string>;
  /** 日志 */
  logger: FastifyBaseLogger;
};

export type RouterServerOptions = {
  formatLogger?: (request: FastifyRequest, reply: FastifyReply) => Record<string, unknown>;
};
