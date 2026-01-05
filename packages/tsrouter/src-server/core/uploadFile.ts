import type { ProcedureDef, RestApiMethod, RS, ServiceClass, UploadFileService } from '../type';
import { trycatchAndMiddlewaresHandle } from '../utils';

class UploadFileServiceClass implements ServiceClass {
  method: RestApiMethod = 'post';

  set(service: UploadFileService): RS {
    return trycatchAndMiddlewaresHandle(this.method, service.name, async (request, ctx) => {
      const formData = await request.formData();
      const response = await service(formData, ctx);
      return new Response(typeof response === 'string' ? response : JSON.stringify(response), { headers: ctx.resHeaders });
    });
  }
}

export function createUploadFile() {
  const handle = (service: UploadFileService) => {
    return new UploadFileServiceClass().set(service) as ProcedureDef<'uploadFile'>;
  };
  return handle;
}
