import type { AppRouter } from '@apps/agent-server/browser';
import { createAppRouter, RefreshFailed, TsRouter } from '@packages/tsrouter/client';
import { redirect } from '@tanstack/react-router';

const ins = new TsRouter({
  baseUrl: import.meta.env.VITE_BASE_URL!,
  prefix: '/api',
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
