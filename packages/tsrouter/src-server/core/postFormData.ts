import type { ServiceClass, PostFormDataService } from '../type';
import type { ProcedureDef } from '@/src-client/type';
import { responseToString, trycatchAndMiddlewaresHandle } from '../utils';
import { AwaitedReturn, Func } from '@packages/utils/types';
import { RestApiMethod } from '@packages/utils';

class PostFormDataServiceClass implements ServiceClass {
  method: RestApiMethod = 'post';

  set(service: PostFormDataService) {
    return trycatchAndMiddlewaresHandle(this.method, service.name, async (request, ctx) => {
      const formData = await request.formData();
      const response = await service(formData, ctx);
      return new Response(responseToString(response), { headers: ctx.resHeaders });
    });
  }
}

export const createPostFormData =
  () =>
  <S extends PostFormDataService>(service: S) => {
    return new PostFormDataServiceClass().set(service) as unknown as ProcedureDef<'postFormData', Func, AwaitedReturn<S>>;
  };
