import { createRouter, Logger, procedure, ReplaceSpecificLeaf } from '@packages/tsrouter/server';
import { login, loginSchema, refreshToken } from '@/services/auth';
import { getUserInfo } from '@/services/users';
import { tsRouter } from '@/services/tsRouterTest';
import { authMiddleware } from '@/middlewares/auth';
import { uploadFile1 } from '@/services/tsRouterTest/upload';
import { trigger } from '@/middlewares/limitRate';
import { corsMiddleware, optionsService } from '@/middlewares/cors';

export const logger = new Logger({
  stdout(data) {
    // console.log(data);
  },
});

const mainAuthRouterTree = {
  user: {
    getUserInfo: procedure.get(getUserInfo),
  },
};

const mainWhiteListRouterTree = {
  auth: {
    login: procedure.post(loginSchema, login),
    refreshToken: procedure.get(refreshToken),
  },

  upload: {
    file: procedure.postFormData(uploadFile1),
  },

  test: {
    tsRouter: tsRouter,
  },
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
