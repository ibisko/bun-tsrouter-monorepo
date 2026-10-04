import { createAppRouter, TsRouter } from '@packages/tsrouter/client';
import type { AppRouter } from './approuter.d.mts';

const ins = new TsRouter({
  baseUrl: import.meta.env.VITE_ICONIFY_SERVER_URL!,
  prefix: '/api',
});

export const IconifyApi = createAppRouter<AppRouter>(ins);
