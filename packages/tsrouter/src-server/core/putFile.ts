import type { PutFileService, ServiceClass } from '../type';
import type { ProcedureDef } from '@/src-client/type';
import { responseToString, trycatchAndMiddlewaresHandle } from '../utils';
import { AwaitedReturn, Func } from '@packages/utils/types';
import { RestApiMethod } from '@packages/utils';

class PutFileServiceClass implements ServiceClass {
  method: RestApiMethod = 'post';

  set(service: PutFileService) {
    return trycatchAndMiddlewaresHandle(this.method, service.name, async (request, ctx) => {
      const response = await service(request, ctx);
      return new Response(responseToString(response), { headers: ctx.resHeaders });
    });
  }
}

export const createPutFile =
  () =>
  <S extends PutFileService>(service: S) => {
    return new PutFileServiceClass().set(service) as unknown as ProcedureDef<'putFile', Func, AwaitedReturn<S>>;
  };
