import { demoService, demosseService, zodDemoSchema, zodDemoSSEService } from '@/services/demo/index';
import { FastifyInstance } from 'fastify';
import { createRouter, procedure, ReplaceSpecificLeaf } from '@packages/tsrouter/server';

const mainAuthRouterTree = {
  demo: {
    aa: procedure.get(zodDemoSchema, demoService),
  },
  aa: {
    post: {
      cc: procedure.post(zodDemoSchema, demoService),
    },
  },
  sse: procedure.sse(zodDemoSSEService, demosseService),
};

const mainWhiteListRouterTree = {};

export const mainAuthRouter = (fastify: FastifyInstance) => createRouter(fastify, mainAuthRouterTree);
export const mainWhiteListRouter = (fastify: FastifyInstance) => createRouter(fastify, mainWhiteListRouterTree);

// export type AppRouter = ReplaceSpecificLeaf<typeof mainAuthRouterTree> ;
// export type AppRouter = typeof mainAuthRouterTree;

export type AppRouter = NonNullable<typeof mainAuthRouterTree>;
