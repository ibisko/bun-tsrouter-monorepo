import type { FastifyInstance } from 'fastify';
import type { RouterServerOptions } from '../type';
import type { RouterServerInterface } from './types';
import { sse } from './sse';
import { uploadFile } from './uploadFile';
import { restApiMethod } from './restApi';

declare module 'fastify' {
  interface FastifyRequest {
    $customData?: {};
  }
}

export class RouterServer implements RouterServerInterface {
  fastify: FastifyInstance;
  formatLogger: RouterServerOptions['formatLogger'];
  constructor(fastify: FastifyInstance, options?: RouterServerOptions) {
    this.fastify = fastify;
    this.formatLogger = options?.formatLogger;
  }

  // 基本的 restApi 方法

  get = restApiMethod(this, 'get');
  post = restApiMethod(this, 'post');
  patch = restApiMethod(this, 'patch');
  put = restApiMethod(this, 'put');
  delete = restApiMethod(this, 'delete');

  // 在这里扩展方法

  sse = sse.bind(this);
  uploadFile = uploadFile.bind(this);
}
