import { userStore } from '@/stores/user';
import type { AppRouter } from '@apps/server/client';
import { createAppRouter, RefreshFailed, TsRouter } from '@packages/tsrouter/client';
import { jsonRequest } from '@packages/utils';
import { redirect } from '@tanstack/react-router';

const ins = new TsRouter({
  baseUrl: import.meta.env.VITE_BASE_URL!,
  prefix: '/api',
  setHeaders: headers => {
    headers.set('authorization', `Bearer ${userStore.token}`);
  },
  async refreshToken(abort) {
    const headers = new Headers({
      authorization: `Bearer ${userStore.refreshToken}`,
    });

    const response = await jsonRequest({
      url: '/api/auth/refresh-token',
      baseUrl: import.meta.env.VITE_BASE_URL!,
      method: 'GET',
      headers: headers,
      skipErrorHandler: true,
    });

    if (!response.ok) {
      // 被拉入黑名单就中断
      if (response.status === 400) {
        throw new RefreshFailed();
      } else if (response.status === 403) {
        return abort();
      }
    }

    const data = await response.json();

    userStore.token = data.token;
    userStore.refreshToken = data.refreshToken;
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
  },
  onResponseError(error) {
    if (error instanceof RefreshFailed) {
      console.log('刷新失败');
      throw redirect({ to: '/', replace: true });
    }
  },
});

export const Api = createAppRouter<AppRouter>(ins);
