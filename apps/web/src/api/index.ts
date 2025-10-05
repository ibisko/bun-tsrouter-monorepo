import { authStore } from '@/stores/admin';
import type { AppRouter } from '@apps/server';
import { createAppRouter, TsRouter } from '@packages/tsrouter/client';

const ins = new TsRouter({
  baseUrl: 'http://localhost:5773',
  prefix: '/api',
  // timeout: 1e3,
  async refreshToken(abort) {
    const response = await fetch('http://localhost:5773/api/auth/refresh-token');

    if (!response.ok) {
      // 被拉入黑名单就中断
      if (response.status === 400) {
        throw new Error();
      } else if (response.status === 403) {
        abort();
        return;
      }
    }
    const data = response.json();
    console.log('refreshToken.data:', data);
    authStore.refreshToken = '';
    authStore.token = '';
  },
});

export const Api = createAppRouter(ins) as AppRouter;
