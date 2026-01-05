import z from 'zod';
import type { Func, AwaitedReturn } from '@packages/utils/types';
import type { Context, ProcedureDef, RestApiMethod, RS, ServiceClass } from '../type';
import { parseZodSchema, trycatchAndMiddlewaresHandle } from '../utils';

class RestApiServiceClass implements ServiceClass {
  constructor(readonly method: RestApiMethod) {}

  set(...args: unknown[]): RS {
    let zodSchema: z.ZodObject | undefined;
    let service: Func;
    if (typeof args[0] !== 'function') {
      zodSchema = args[0] as z.ZodObject;
      service = args[1] as Func;
    } else {
      service = args[0] as Func;
    }

    return trycatchAndMiddlewaresHandle(this.method, service.name, async (request, ctx) => {
      const param = zodSchema ? await parseZodSchema(request, zodSchema) : undefined;
      let response;
      if (param) {
        const _service = service as HasParamService<NonNullable<typeof zodSchema>>;
        response = await _service(param, ctx);
      } else {
        const _service = service as NonParamService;
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
  <S extends NonParamService>(service: S): ProcedureDef<M, Func, AwaitedReturn<S>>;
  <T extends z.ZodObject, S extends HasParamService<T>>(schema: T, service: S): ProcedureDef<M, T, AwaitedReturn<S>>;
};

type HasParamService<T extends z.ZodObject> = (param: z.output<T>, ctx: Context) => any;
type NonParamService = (ctx: Context) => any;
