import z from 'zod';
import type { Func, AwaitedReturn } from '@packages/utils/types';
import type { ProcedureDef, RestApiMethod, RestApiService, RS, ServiceClass } from '../type';
import { parseZodSchema, trycatchAndMiddlewaresHandle } from '../utils';

class RestApiServiceClass implements ServiceClass {
  method: RestApiMethod;
  constructor(method: RestApiMethod) {
    this.method = method;
  }

  set(...args: unknown[]): RS {
    let zodSchema: z.ZodObject | undefined;
    let service: Func;
    if (typeof args[0] !== 'function') {
      zodSchema = args[0] as z.ZodObject;
      service = args[1] as Func;
    } else {
      service = args[0] as Func;
    }

    return trycatchAndMiddlewaresHandle(this.method, service, async (request, server, ctx) => {
      const param = zodSchema ? await parseZodSchema(request, zodSchema) : undefined;
      let response;
      if (param) {
        const _service = service as RestApiService<NonNullable<typeof zodSchema>>;
        response = await _service(param, ctx);
      } else {
        const _service = service as RestApiService;
        response = await _service(ctx);
      }

      return new Response(typeof response === 'string' ? response : JSON.stringify(response), {
        headers: ctx.resHeaders,
      });
    });
  }
}

export function createStandardMethod<T extends RestApiMethod>(method: T) {
  const handle: Handle<T> = (...arg1: unknown[]) => {
    return new RestApiServiceClass(method).set(...arg1) as ProcedureDef<T>;
  };
  return handle;
}

type Handle<M extends RestApiMethod> = {
  <S extends RestApiService>(service: S): ProcedureDef<M, Func, AwaitedReturn<S>>;
  <T extends z.ZodObject, S extends RestApiService<T>>(schema: T, service: S): ProcedureDef<M, T, AwaitedReturn<S>>;
};
