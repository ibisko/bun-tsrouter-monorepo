import type { ServiceClass, UploadFileService } from '../type';
import type { ProcedureDef } from '@/src-client/type';
import { responseToString, trycatchAndMiddlewaresHandle } from '../utils';
import { AwaitedReturn, Func } from '@packages/utils/types';
import { RestApiMethod } from '@packages/utils';

class UploadFileServiceClass implements ServiceClass {
  method: RestApiMethod = 'post';

  set(service: UploadFileService) {
    return trycatchAndMiddlewaresHandle(this.method, service.name, async (request, ctx) => {
      const formData = await request.formData();
      const response = await service(formData, ctx);
      return new Response(responseToString(response), { headers: ctx.resHeaders });
    });
  }
}

export const createUploadFile =
  () =>
  <S extends UploadFileService>(service: S) => {
    return new UploadFileServiceClass().set(service) as unknown as ProcedureDef<'uploadFile', Func, AwaitedReturn<S>>;
  };
