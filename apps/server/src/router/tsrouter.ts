import { demoService, demoServiceEmp, demosseService, demosseServiceEmp, zodDemoSchema, zodDemoSSEService } from '@/services/demo/index';
import { FastifyInstance } from 'fastify';
import { createRouter, procedure, ReplaceSpecificLeaf } from '@packages/tsrouter/server';
import { authHook } from '@/middlewares/auth';
import { login, loginSchema, refreshToken } from '@/services/auth';
import { getUserInfo } from '@/services/users';
import { tsRouter } from '@/services/tsRouterTest';

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
  sse1: procedure.sse(zodDemoSSEService, async (param, { write }, optional) => {
    param.KJKFD;
    optional;
    return { running: () => {} };
  }),
  sseEmp: procedure.sse(demosseServiceEmp),
};

const mainWhiteListRouterTree = {
  auth: {
    login: procedure.post(loginSchema, login),
    refreshToken: procedure.get(refreshToken),
  },

  test: {
    tsRouter,
  },
};

export const mainAuthRouter = (fastify: FastifyInstance) => {
  fastify.addHook('onRequest', authHook);
  createRouter({ fastify, router: mainAuthRouterTree });
};
export const mainWhiteListRouter = (fastify: FastifyInstance) => {
  // 黑名单、鉴权，只拿 Headers 里的 authorization
  // fastify.addHook('onRequest', authHook);

  // todo service Error 异常捕获
  // fastify.addHook('onError', () => {s});
  // todo 如果 onRequest 抛出的异常，后面 onError 能否捕获到？

  // todo 返回值包装
  // fastify.addHook('onSend', () => {});

  createRouter({
    fastify,
    router: mainWhiteListRouterTree,
  });
};

export type AppRouter = ReplaceSpecificLeaf<typeof mainAuthRouterTree & typeof mainWhiteListRouterTree>;
