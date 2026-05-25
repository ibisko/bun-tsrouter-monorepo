import z from 'zod';
import { parseZodSchema, trycatchAndMiddlewaresHandle } from '../utils';
import type { ServiceClass, Context } from '../type';
import type { ProcedureDef } from '@/src-client/type';
import { WatchDog } from '@packages/utils';
import { ServiceError } from '../error';
import { AwaitedReturn, Func } from '@packages/utils/types';
import { RestApiMethod } from '@packages/utils';
import { MaybePromise } from 'bun';

class SseServiceClass implements ServiceClass {
  method: RestApiMethod = 'post';

  set(...args: unknown[]) {
    let zodSchema: z.ZodObject | undefined;
    let service: Function;
    if (typeof args[0] !== 'function') {
      zodSchema = args[0] as z.ZodObject;
      service = args[1] as Function;
    } else {
      service = args[0] as Function;
    }

    return trycatchAndMiddlewaresHandle(this.method, service.name, async (request, ctx) => {
      const param = zodSchema ? await parseZodSchema(request, zodSchema) : undefined;
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          // 设置看门狗，每5s发送一次心跳来保持连接
          const watchDog = new WatchDog(() => {
            console.log('设置看门狗，每5s发送一次心跳来保持连接');
            controller.enqueue(encoder.encode(':\n\n'));
            watchDog.feed();
          }, 1e3 * 5);

          // 断开连接时
          request.signal.addEventListener('abort', async () => {
            watchDog.kill();
          });

          // todo 需要提供外部调用 id，用于从指定 id 开始恢复，便于 web 端重连时指定恢复id
          let id = 0;
          const callback: WriteFunc = async (data, event = 'message') => {
            request.signal.throwIfAborted();
            watchDog.feed();
            const resData = JSON.stringify({ id, data, event });
            controller.enqueue(encoder.encode(resData + '\n\n'));
            id++;
          };

          const optional = {
            write: callback,
            signal: request.signal,
            ctx,
          };

          try {
            if (param) {
              await service(param, optional);
            } else {
              await service(optional);
            }
          } catch (error) {
            let msg: string, reason: string | undefined, data, serviceError: string | undefined;
            if (error instanceof ServiceError) {
              msg = error.message;
              reason = error.reason;
              data = error.data;
              serviceError = error.message;
            } else if (error instanceof DOMException && error.name === 'AbortError') {
              // 网页上的中断
              msg = '中断';
              reason = 'SSE_ABORT_ERROR';
              serviceError = '网页abort';
            } else if (error instanceof Error) {
              msg = error.message;
              reason = 'sse error';
              data = {
                stack: error.stack,
                name: error.name,
                cause: error.cause,
              };
              serviceError = error.message;
            } else {
              msg = '异常';
              reason = 'sse error no-error';
              data = { error };
              serviceError = '未知异常';
            }
            if (serviceError) {
              await callback(serviceError, 'SERVICE_ERROR');
            }
            ctx.logger.error({ step: 'service', msg, reason, data });
          }
          watchDog.kill();
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'access-control-allow-origin': '*',
          'Content-Type': 'text/event-stream; charset=utf-8',
          Connection: 'keep-alive',
          'Cache-Control': 'no-cache,no-transform',
          'x-no-compression': '1',
        },
      });
    });
  }
}

export const createSseMethod =
  (): Handle =>
  (...arg1: unknown[]) => {
    return new SseServiceClass().set(...arg1) as unknown as ProcedureDef<'sse'>;
  };

/** 这里定义在 server 中的定义类型 */

type Handle = {
  <S extends SseService>(service: S): ProcedureDef<'sse', Func, AwaitedReturn<S>>;
  <T extends z.ZodObject, S extends SseService<T>>(schema: T, service: S): ProcedureDef<'sse', T, AwaitedReturn<S>>;
};

// prettier-ignore
export type SseService<T extends z.ZodObject | null = null> =
  T extends z.ZodObject ? (param: z.output<T>, optional: SseServiceOptional) => MaybePromise<void> :
                          (optional: SseServiceOptional) => MaybePromise<void>;

export type SseServiceOptional = {
  write: WriteFunc;
  signal: AbortSignal;
  ctx: Context;
};

/** sse写消息的方法 */
export type WriteFunc = {
  /** 自定义 event */
  (data: any, event?: string): Promise<void>;
};
