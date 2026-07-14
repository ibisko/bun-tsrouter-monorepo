import { userStore } from '@/stores/user';
import type { AppRouter } from '@apps/server/client';
import { createAppRouter, RefreshFailed, ResponseError, TsRouter } from '@packages/tsrouter/client';

const ins = new TsRouter({
  baseUrl: import.meta.env.VITE_BASE_URL!,
  prefix: '/api',
  setHeaders: headers => {
    headers.set('authorization', `Bearer ${userStore.token}`);
  },
  async refreshToken(abort) {
    try {
      const res = await Api.auth.refreshToken.get(null, {
        headers: { authorization: `Bearer ${userStore.refreshToken}` },
        skipRefreshToken: true,
      });
      userStore.token = res.token;
      userStore.refreshToken = res.refreshToken;
      localStorage.setItem('token', res.token);
      localStorage.setItem('refreshToken', res.refreshToken);
    } catch (error) {
      if (error instanceof ResponseError) {
        // ip 被拉黑了啊
        if (error.status === 403) return abort();
      }
      throw new RefreshFailed();
    }
  },
});

export const Api = createAppRouter<AppRouter>(ins);
