import {
  demoService,
  demoServiceEmp,
  demosseService,
  demosseServiceEmp,
  zodDemoSchema,
  zodDemoSSEService,
} from '@/services/demo/index';
import { FastifyInstance } from 'fastify';
import { createRouter, procedure, ReplaceSpecificLeaf } from '@packages/tsrouter/server';
import { sse1, sse1Schema, sse2 } from '@/services/tsRouterTest/sse';
import { get1, get2, get2Schema } from '@/services/tsRouterTest/rest';
import { authHook } from '@/middlewares/auth';
import { login, loginSchema, refreshToken } from '@/services/auth';
import { getUserInfo } from '@/services/users';

const mainAuthRouterTree = {
  user: {
    getUserInfo: procedure.get(getUserInfo),
  },
  demo: {
    $aa: procedure.get(zodDemoSchema, demoService),
  },
  aa: {
    post: {
      cc: procedure.post(zodDemoSchema, demoService),
      CCEmp: procedure.post(demoServiceEmp),
    },
  },
  sse: procedure.sse(zodDemoSSEService, demosseService),
  sseEmp: procedure.sse(demosseServiceEmp),
};

const mainWhiteListRouterTree = {
  auth: {
    login: procedure.post(loginSchema, login),
    refreshToken: procedure.get(refreshToken),
  },

  test: {
    tsRouter: {
      sse1: procedure.sse(sse1Schema, sse1),
      sse2: procedure.sse(sse2),
      get1: procedure.get(get1),
      get2: procedure.get(get2Schema, get2),
    },
  },
};

export const mainAuthRouter = (fastify: FastifyInstance) => {
  fastify.addHook('onRequest', authHook);
  createRouter(fastify, mainAuthRouterTree);
};
export const mainWhiteListRouter = (fastify: FastifyInstance) => {
  // 黑名单、鉴权，只拿 Headers 里的 authorization
  // fastify.addHook('onRequest', authHook);

  // todo service Error 异常捕获
  // fastify.addHook('onError', () => {s});
  // todo 如果 onRequest 抛出的异常，后面 onError 能否捕获到？

  // todo 返回值包装
  // fastify.addHook('onSend', () => {});

  createRouter(fastify, mainWhiteListRouterTree, {
    formatLogger: request => ({
      ip: request.ip,
      url: request.url,
      params: request.params,
      query: request.query,
      body: request.body,
    }),
  });
};

export type AppRouter = ReplaceSpecificLeaf<typeof mainAuthRouterTree & typeof mainWhiteListRouterTree>;
