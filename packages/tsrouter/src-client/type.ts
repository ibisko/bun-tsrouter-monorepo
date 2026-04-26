import z from 'zod';
import { MaybePromise } from 'bun';
import type { Func, IsPlainObject } from '@packages/utils/types';
import type { Method } from '@/types';
import { RestApiMethod } from '@packages/utils';

export type TsRouterOptions = {
  baseUrl: string;
  prefix?: string;
  timeout?: number;
  setHeaders?: (headers: Headers) => MaybePromise<void>;
  refreshToken?: (abort: () => void) => Promise<void>;
  onResponseError?: (error: unknown) => Promise<void>;
};

export type MethodOptions = {
  query?: Record<string, string>;
  headers?: Record<string, string>;
  /** 用于 Controller 中断 */
  signal?: AbortSignal;
  timeout?: number;
};

export type UploadMethodOptions = MethodOptions & {
  onPercent?: (percent: number) => void;
};

export type RestApiParams = {
  method: RestApiMethod;
  path: string | string[];
  query?: Record<string, string> | null;
  body?: any;
  options?: MethodOptions;
};

export abstract class TsRouterClass {
  abstract baseUrl: string;
  abstract isRefreshing: boolean;
  abstract prefix?: string;
  abstract timeout: number;
  abstract interceptDuringRefreshResolves: { resolve: (val?: unknown) => void; reject: (error: Error) => void }[];
  abstract setHeaders: TsRouterOptions['setHeaders'];
  abstract refreshToken: TsRouterOptions['refreshToken'];
  abstract onResponseError: TsRouterOptions['onResponseError'];
  abstract refreshTokenHandle: () => Promise<void>;
}

// =============== 基础和扩展方法 ===============

/** 用于在 server 导出，在 clinet 使用的 AppRouter */
export type ReplaceSpecificLeaf<T> = NonNullable<
  // $作为前一个路径的函数参数
  // prettier-ignore
  keyof T extends `$${string}`    ? Record<string, ReplaceSpecificLeaf<T[keyof T]>> :
  T extends ProcedureDef<infer M> ? { [K in M]: T["_func"] } :
  IsPlainObject<T> extends true   ? { [K in keyof T]: ReplaceSpecificLeaf<T[K]> } :
                                    T
>;

export type ProcedureDef<M extends Method, T extends z.ZodObject | Func = any, R = any> = {
  _method: M;
  // 单独条件区分，可扩展
  // todo uploadFile需要更完善些
  // prettier-ignore
  _func:
    M extends 'sse'         ? SseHandler<T> :
    M extends 'uploadFile'  ? (formData: FormData, options?: UploadMethodOptions) => Promise<R> :
    M extends RestApiMethod ? StandardHandler<T, R> :
                              never;
};

// ========== 这里定义 client 中不同 method 对应的提示类型 ===========

type StandardHandler<T, R> =
  // prettier-ignore
  T extends z.ZodObject ? (params: z.input<T>, options?: MethodOptions) => Promise<R>
                        : (parmas?: null, options?: MethodOptions) => Promise<R>;

type SseHandler<T> =
  // prettier-ignore
  T extends z.ZodObject ? (params: z.input<T>, options?: MethodOptions) =>
                              Promise<SseHandlerCallback> :
                              (parmas?: null, options?: MethodOptions) =>
                              Promise<SseHandlerCallback>;

type SseHandlerCallback = <K = any>(callback: SseMessageHandler<K>) => Promise<void>;

export type SseMessageHandler<T = any> = {
  (data: { id: number; event: string; data: T }): void;
};
