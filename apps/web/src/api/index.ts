import { userStore } from '@/stores/user';
import type { AppRouter } from '@apps/server';
import { createAppRouter, RefreshFailed, ResponseError, TsRouter } from '@packages/tsrouter/client';
import { redirect } from '@tanstack/react-router';

const ins = new TsRouter({
  baseUrl: 'http://localhost:5773',
  prefix: '/api',
  // timeout: 1e3,
  headers: () => {
    return new Headers({
      authorization: `Bearer ${userStore.token}`,
    });
  },
  async refreshToken(abort) {
    const response = await fetch('http://localhost:5773/api/auth/refresh-token', {
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
    if (error instanceof ResponseError) {
      console.log('ResponseError', error.message, error.status);
      throw redirect({ to: '/', replace: true });
    } else if (error instanceof RefreshFailed) {
      console.log('刷新失败');
      throw redirect({ to: '/', replace: true });
    }
  },
});

export const Api = createAppRouter<AppRouter>(ins);
