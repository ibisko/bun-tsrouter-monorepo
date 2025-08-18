import z from 'zod';
import type { FastifyInstance } from 'fastify';
import { wrapperService } from '@/common/routerWrapper.js';

class CreateGetRouter<T, R> {
  constructor(readonly zodSchema: T, readonly service: (param: z.output<T>) => R) {}
  get(fastify: FastifyInstance, path: string) {
    fastify.get(path, (req, reply) => wrapperService(req, 'get', reply, this.zodSchema, this.service));
  }
}

class CreatePostRouter<T, R> {
  constructor(readonly zodSchema: T, readonly service: (param: z.output<T>) => R) {}
  post(fastify: FastifyInstance, path: string) {
    fastify.post(path, (req, reply) => wrapperService(req, 'post', reply, this.zodSchema, this.service));
  }
}

export const procedure = {
  get: <T, R>(zodSchema: T, service: (param: z.output<T>) => R) => new CreateGetRouter(zodSchema, service),
  post: <T, R>(zodSchema: T, service: (param: z.output<T>) => R) => new CreatePostRouter(zodSchema, service),
};

export const createRouter = (fastify: FastifyInstance, routerTree: any) => {
  const parseRouter = (router: any, prefix = '') => {
    for (const [key, value] of Object.entries(router)) {
      const _prefix = prefix + '/' + key;
      if (value instanceof CreatePostRouter) {
        value.post(fastify, _prefix);
      } else if (value instanceof CreateGetRouter) {
        value.get(fastify, _prefix);
      } else {
        parseRouter(value, _prefix);
      }
    }
  };
  parseRouter(routerTree);
};

// 判断是否为 普通对象, 排除数组/函数/基本数据类型
type IsPlainObject<T> = T extends object ? (T extends readonly any[] ? false : true) : false;
export type ReplaceSpecificLeaf<T> = T extends CreateGetRouter<any, any>
  ? { get: T['service'] }
  : T extends CreatePostRouter<any, any>
  ? { post: T['service'] }
  : IsPlainObject<T> extends true
  ? { [K in keyof T]: ReplaceSpecificLeaf<T[K]> }
  : T;
