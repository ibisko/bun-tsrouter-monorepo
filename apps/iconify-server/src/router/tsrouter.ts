import { createRouter, Logger, ReplaceSpecificLeaf } from '@packages/tsrouter/server';
import { corsMiddleware, optionsService } from '@/middlewares/cors';
import { iconSetRouter } from '@/services/iconSet';
import { iconRouter } from '@/services/icon';
import { iconifyRouter } from '@/services/local';

export const logger = new Logger({
  stdout(data) {
    console.log(data);
  },
});

const mainWhiteListRouterTree = {
  iconSet: iconSetRouter,
  icon: iconRouter,
  iconifyLocal: iconifyRouter,
};

export const mainWhiteListRouter = createRouter({
  prefix: '/api',
  logger,
  middlewares: [corsMiddleware],
  router: mainWhiteListRouterTree,
  optionsService,
});

export type AppRouter = ReplaceSpecificLeaf<typeof mainWhiteListRouterTree>;
