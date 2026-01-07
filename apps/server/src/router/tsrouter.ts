import { createRouter, procedure, ReplaceSpecificLeaf } from '@packages/tsrouter/server';
import { login, loginSchema, refreshToken } from '@/services/auth';
import { getUserInfo } from '@/services/users';
import { tsRouter } from '@/services/tsRouterTest';
import { logger } from '@/common/logger';
import { authMiddleware } from '@/middlewares/auth';
import { uploadFile1 } from '@/services/tsRouterTest/upload';
import { limitRateMiddleware } from '@/middlewares/limitRate';
import { corsMiddleware } from '@/middlewares/cors';

const mainAuthRouterTree = {
  /** 用户 */
  user: {
    /** 用户信息 */
    getUserInfo: procedure.get(getUserInfo),
  },
};

const mainWhiteListRouterTree = {
  auth: {
    login: procedure.post(loginSchema, login),
    refreshToken: procedure.get(refreshToken),
  },

  upload: {
    file: procedure.uploadFile(uploadFile1),
  },

  test: {
    tsRouter,
  },
};

export const mainAuthRouter = createRouter({
  prefix: ['api'],
  logger,
  middlewares: [limitRateMiddleware, authMiddleware, corsMiddleware],
  router: mainAuthRouterTree,
});

export const mainWhiteListRouter = createRouter({
  prefix: ['api'],
  logger,
  middlewares: [limitRateMiddleware, corsMiddleware],
  router: mainWhiteListRouterTree,
});

export type AppRouter = ReplaceSpecificLeaf<typeof mainAuthRouterTree & typeof mainWhiteListRouterTree>;
