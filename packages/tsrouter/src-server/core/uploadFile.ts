import type { ProcedureDef, RestApiMethod, RS, ServiceClass, UploadFileService } from '../type';
import { responseToString, trycatchAndMiddlewaresHandle } from '../utils';
import { AwaitedReturn, Func } from '@packages/utils/types';

class UploadFileServiceClass implements ServiceClass {
  method: RestApiMethod = 'post';

  set(service: UploadFileService): RS {
    return trycatchAndMiddlewaresHandle(this.method, service.name, async (request, ctx) => {
      const formData = await request.formData();
      const response = await service(formData, ctx);
      return new Response(responseToString(response), { headers: ctx.resHeaders });
    });
  }
}

export function createUploadFile() {
  const handle = <S extends UploadFileService>(service: S) => {
    return new UploadFileServiceClass().set(service) as ProcedureDef<'uploadFile', Func, AwaitedReturn<S>>;
  };
  return handle;
}
