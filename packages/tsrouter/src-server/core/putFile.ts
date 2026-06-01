import type { PutFileService, ServiceClass } from '../type';
import type { ProcedureDef } from '@/src-client/type';
import { responseToString, trycatchAndMiddlewaresHandle } from '../utils';
import { AwaitedReturn, Func } from '@packages/utils/types';
import { RestApiMethod } from '@packages/utils';
import { ServiceError } from '../error';

class PutFileServiceClass implements ServiceClass {
  method: RestApiMethod = 'put';

  set(service: PutFileService) {
    return trycatchAndMiddlewaresHandle(this.method, service.name, async (request, ctx) => {
      if (!request.body) throw new ServiceError({ message: 'no body' });
      const response = await service(request.body, ctx);
      return new Response(responseToString(response), { headers: ctx.resHeaders });
    });
  }
}

export const createPutFile =
  () =>
  <S extends PutFileService>(service: S) => {
    return new PutFileServiceClass().set(service) as unknown as ProcedureDef<'putFile', Func, AwaitedReturn<S>>;
  };
