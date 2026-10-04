import { createRouter, Logger, procedure, ReplaceSpecificLeaf } from '@packages/tsrouter/server';
import { trigger } from '@/middlewares/limitRate';
import { corsMiddleware, optionsService } from '@/middlewares/cors';
import { chatRouter } from '@/services/chat';
import { toolsRouter } from '@/tools';
import { llmRouter } from '@/services/llm';
import { iconifyRouter } from '@/services/iconify/local';

export const logger = new Logger();

const mainWhiteListRouterTree = {
  chat: chatRouter,
  llm: llmRouter,

  iconifyLocal: iconifyRouter,
  tools: toolsRouter,
};

export const mainWhiteListRouter = createRouter({
  prefix: '/api',
  logger,
  middlewares: [trigger, corsMiddleware],
  router: mainWhiteListRouterTree,
  optionsService,
});

export type AppRouter = ReplaceSpecificLeaf<typeof mainWhiteListRouterTree>;
