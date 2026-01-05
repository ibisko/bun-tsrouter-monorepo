import z from 'zod';
import { parseZodSchema, trycatchAndMiddlewaresHandle } from '../utils';
import type { ProcedureDef, RestApiMethod, RS, ServiceClass, SseService, WriteFunc } from '../type';
import { WatchDog } from '@packages/utils';
import { ServiceError } from '../error';
import { AwaitedReturn, Func } from '@packages/utils/types';

class SseServiceClass implements ServiceClass {
  method: RestApiMethod = 'get';

  set(...args: unknown[]): RS {
    let zodSchema: z.ZodObject | undefined;
    let service: Function;
    if (typeof args[0] !== 'function') {
      zodSchema = args[0] as z.ZodObject;
      service = args[1] as Function;
    } else {
      service = args[0] as Function;
    }

    // todo 另外的 yield 实现方案?
    return trycatchAndMiddlewaresHandle(this.method, service.name, async (request, ctx) => {
      const param = zodSchema ? parseZodSchema(request, zodSchema) : undefined;
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          // 设置看门狗，每15s发送一次心跳来保持连接
          const watchDog = new WatchDog(() => {
            controller.enqueue(encoder.encode(':\n\n'));
            watchDog.feed();
          }, 1e3 * 15);

          // 断开连接时
          request.signal.addEventListener('abort', async () => {
            // if (watchDog.isStop) return;
            console.log('连接突然中断');
            watchDog.kill();
            // reject(new ServiceError({ message: '连接突然中断' }));
          });

          let id = 0;
          const callback: WriteFunc = async (data, event?: string) => {
            request.signal.throwIfAborted();
            watchDog.feed();
            const msg = [`id: ${id}`, `data: ${data}`];
            if (event) {
              msg.push(`event: ${event}`);
            }
            controller.enqueue(encoder.encode(msg.join('\n') + '\n\n'));
            id++;
          };

          try {
            const optional = {
              write: callback,
              signal: request.signal,
              ctx,
            };
            // todo 想想 disconnectHandle 还是需要触发
            if (param) {
              await service(param, optional);
            } else {
              await service(optional);
            }

            watchDog.kill();
            controller.close();
          } catch (error) {
            // todo 如果是 signal 的抛出就无视
            if (error instanceof ServiceError) {
              // 处理client的主动断开引起的异常
              // if (watchDog.isStop) {
              // ctx.logger.error(error.format());
              // await finishHandle?.();
              // return reply;
              // }
              // 其他异常直接记录
              // ctx.logger.error(error.format());
            } else if (error instanceof Error) {
              if (error.name === 'AbortError') {
                // reject(new ServiceError({ message: error.message }));
              } else {
                // await callback(error.message, 'error');
                // reject(new ServiceError({ message: error.message }));
              }
            }
          }
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

export function createSseMethod() {
  const handle: Handle = (...arg1: unknown[]) => {
    return new SseServiceClass().set(...arg1) as ProcedureDef<'sse'>;
  };
  return handle;
}

type Handle = {
  <S extends SseService>(service: S): ProcedureDef<'sse', Func, AwaitedReturn<S>>;
  <T extends z.ZodObject, S extends SseService<T>>(schema: T, service: S): ProcedureDef<'sse', T, AwaitedReturn<S>>;
};
