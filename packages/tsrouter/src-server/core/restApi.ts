import { ServiceError } from '../error';
import { getContext, getPath, parseZodSchema } from '../utils';
import type { RestApiMethod, RestApiService } from '../type';
import type { RouterServerInterface, RouterServerRestApiParam } from './types';

export const restApiMethod =
  (_this: RouterServerInterface, method: RestApiMethod) =>
  ({ path, zodSchema, service }: RouterServerRestApiParam) => {
    const url = getPath(path);
    const logger = _this.fastify.log.child({ method: service.name });
    _this.fastify[method](url, async (request, reply) => {
      // 参数校验
      let param = null;
      if (zodSchema) {
        param = parseZodSchema(zodSchema, method === 'get' ? request.query : request.body);
      }
      // 设置日志实例，绑定到 ctx
      const ctx = getContext(request, logger);
      console.log('设置日志实例，绑定到 ctx');
      if (_this.formatLogger) {
        ctx.logger = ctx.logger.child(_this.formatLogger(request, reply));
      }

      // 执行 service 捕获异常
      try {
        let response;
        if (param) {
          const _service = service as RestApiService<NonNullable<typeof zodSchema>>;
          response = await _service(param, ctx);
        } else {
          const _service = service as RestApiService;
          response = await _service(ctx);
        }

        reply.send(response ?? { msg: 'success' });
      } catch (error) {
        if (error instanceof ServiceError) {
          ctx.logger.error(error.format());
          throw error;
        }
        const reason = error instanceof Error ? error.message : error;
        const serviceError = new ServiceError({ message: '意外异常', reason, isAccident: true });
        ctx.logger.error(serviceError.format());
        throw serviceError;
      }
    });
  };
