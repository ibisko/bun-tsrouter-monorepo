import z from 'zod';
import { parseZodSchema, trycatchAndMiddlewaresHandle } from '../utils';
import type { RegisterableProcedure, RestApiMethod, RestApiService, RS, ServiceClass } from '../type';
import { Func } from '@packages/utils/types';

class RestApiServiceClass implements ServiceClass {
  method: RestApiMethod;
  constructor(method: RestApiMethod) {
    this.method = method;
  }

  set(...args: unknown[]): RS {
    let zodSchema: z.ZodObject | undefined;
    let service: Function;
    if (typeof args[0] !== 'function') {
      zodSchema = args[0] as z.ZodObject;
      service = args[1] as Function;
    } else {
      service = args[0] as Function;
    }

    return trycatchAndMiddlewaresHandle(this.method, service, async (request, server, ctx) => {
      const param = zodSchema ? parseZodSchema(request, zodSchema) : undefined;
      let response;
      if (param) {
        const _service = service as RestApiService<NonNullable<typeof zodSchema>>;
        response = await _service(param, ctx);
      } else {
        const _service = service as RestApiService;
        response = await _service(ctx);
      }
      return new Response(typeof response === 'string' ? response : JSON.stringify(response));
    });
  }
}

export function createStandardMethod<T extends RestApiMethod>(method: T) {
  function handle<S extends RestApiService<null> = RestApiService<null>>(service: S): RegisterableProcedure<typeof method, Func, Awaited<ReturnType<S>>>;
  function handle<T extends z.ZodObject, S extends RestApiService<T>>(
    schema: T,
    service: S,
  ): RegisterableProcedure<typeof method, T, Awaited<ReturnType<S>>>;
  function handle(...arg1: unknown[]) {
    return new RestApiServiceClass(method).set(...arg1) as RegisterableProcedure<typeof method>;
  }
  return handle;
}
