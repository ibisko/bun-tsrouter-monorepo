import { userStore } from '@/stores/user';
import type { AppRouter } from '@apps/server/browser';
import { createAppRouter, RefreshFailed, ResponseError, TsRouter } from '@packages/tsrouter/client';
import { redirect } from '@tanstack/react-router';

const ins = new TsRouter({
  baseUrl: import.meta.env.VITE_BASE_URL!,
  prefix: '/api',
  setHeaders: headers => {
    headers.set('authorization', `Bearer ${userStore.token}`);
  },
  async refreshToken(abort) {
    const url = new URL('/api/auth/refresh-token', import.meta.env.VITE_BASE_URL);
    const response = await fetch(url.href, {
      headers: {
        authorization: `Bearer ${userStore.refreshToken}`,
      },
    });

    if (!response.ok) {
      // 被拉入黑名单就中断
      if (response.status === 400) {
        throw new RefreshFailed();
      } else if (response.status === 403) {
        abort();
        return;
      }
    }

    const data = await response.json();
    userStore.token = data.token;
    userStore.refreshToken = data.refreshToken;
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
  },
  onResponseError(error) {
    // if (error instanceof ResponseError) {
    //   console.log('ResponseError', error.message, error.status);
    //   throw redirect({ to: '/', replace: true });
    // } else
    if (error instanceof RefreshFailed) {
      console.log('刷新失败');
      throw redirect({ to: '/', replace: true });
    }
  },
});

export const Api = createAppRouter<AppRouter>(ins);
