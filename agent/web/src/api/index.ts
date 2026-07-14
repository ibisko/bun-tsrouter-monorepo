import type { AppRouter } from '@apps/agent-server/client';
import { createAppRouter, TsRouter } from '@packages/tsrouter/client';

const ins = new TsRouter({
  baseUrl: import.meta.env.VITE_BASE_URL!,
  prefix: '/api',
});

export const Api = createAppRouter<AppRouter>(ins);
