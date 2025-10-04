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

const mainAuthRouterTree = {
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

const mainWhiteListRouterTree = {};

export const mainAuthRouter = (fastify: FastifyInstance) => {
  // 鉴权、黑名单
  fastify.addHook('onRequest', (req, reply, done) => {
    // todo 来个鉴权
    // todo req.customData
    done();
    // done(new Error('测试权限异常'));
  });
  createRouter(fastify, mainAuthRouterTree);
};
export const mainWhiteListRouter = (fastify: FastifyInstance) => createRouter(fastify, mainWhiteListRouterTree);
export type AppRouter = ReplaceSpecificLeaf<typeof mainAuthRouterTree>;
