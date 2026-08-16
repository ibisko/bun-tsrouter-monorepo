import z from 'zod';
import type { Func, AwaitedReturn } from '@packages/utils/types';
import type { Context, ServiceClass } from '../type';
import type { ProcedureDef } from '@/src-client/type';
import { parseZodSchema, responseToString, trycatchAndMiddlewaresHandle } from '../utils';
import { RestApiMethod } from '@packages/utils';
import { Method } from '@/types';

class RestApiServiceClass implements ServiceClass {
  constructor(readonly method: RestApiMethod) {}

  set(...args: unknown[]) {
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
      if (response instanceof Response) return response;
      return new Response(responseToString(response), { headers: ctx.resHeaders });
    });
  }
}

export const createStandardMethod =
  <T extends RestApiMethod>(method: T): Handle<T> =>
  (...arg1: unknown[]) => {
    return new RestApiServiceClass(method).set(...arg1) as unknown as ProcedureDef<T>;
  };

type Handle<M extends Method> = {
  <S extends NonParamService>(service: S): ProcedureDef<M, Func, AwaitedReturn<S>>;
  <T extends z.ZodObject, S extends HasParamService<T>>(schema: T, service: S): ProcedureDef<M, T, AwaitedReturn<S>>;
};

type HasParamService<T extends z.ZodObject> = (param: z.output<T>, ctx: Context) => any;
type NonParamService = (ctx: Context) => any;

export const createDownloadMethod =
  (): Handle<'download'> =>
  (...arg1: unknown[]) => {
    return new RestApiServiceClass('get').set(...arg1) as unknown as ProcedureDef<'download'>;
  };
