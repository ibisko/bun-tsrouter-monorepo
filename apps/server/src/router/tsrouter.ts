import { createRouter, procedure, ReplaceSpecificLeaf } from '@packages/tsrouter/server';
import { login, loginSchema, refreshToken } from '@/services/auth';
import { getUserInfo } from '@/services/users';
import { tsRouter } from '@/services/tsRouterTest';
import { logger } from '@/common/logger';
import { authHook } from '@/middlewares/auth';
import { uploadFile1 } from '@/services/tsRouterTest/upload';
import { limitRate } from '@/middlewares/limitRate';
import { cors } from '@/middlewares/cors';

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
  middlewares: [limitRate, authHook, cors],
  router: mainAuthRouterTree,
});

export const mainWhiteListRouter = createRouter({
  prefix: ['api'],
  logger,
  middlewares: [limitRate, cors],
  router: mainWhiteListRouterTree,
});

export type AppRouter = ReplaceSpecificLeaf<typeof mainAuthRouterTree & typeof mainWhiteListRouterTree>;
