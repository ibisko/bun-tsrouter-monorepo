import { createRouter, Logger, procedure, ReplaceSpecificLeaf } from '@packages/tsrouter/server';
import { authMiddleware } from '@/middlewares/auth';
import { trigger } from '@/middlewares/limitRate';
import { corsMiddleware, optionsService } from '@/middlewares/cors';
import { chatRouter } from '@/services/chat';
import { iconifyRouter } from '@/services/iconify/router';
import { toolsRouter } from '@/tools';
import { llmRouter } from '@/services/llm';

export const logger = new Logger();

const mainAuthRouterTree = {};

const mainWhiteListRouterTree = {
  chat: chatRouter,
  llm: llmRouter,

  iconify: iconifyRouter,
  tools: toolsRouter,
};

export const mainAuthRouter = createRouter({
  prefix: '/api',
  logger,
  middlewares: [trigger, authMiddleware, corsMiddleware],
  router: mainAuthRouterTree,
  optionsService,
});

export const mainWhiteListRouter = createRouter({
  prefix: '/api',
  logger,
  middlewares: [trigger, corsMiddleware],
  router: mainWhiteListRouterTree,
  optionsService,
});

export type AppRouter = ReplaceSpecificLeaf<typeof mainAuthRouterTree & typeof mainWhiteListRouterTree>;
