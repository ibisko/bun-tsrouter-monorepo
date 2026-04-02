import { Middleware } from '@packages/tsrouter/server';

export const corsMiddleware: Middleware = (_, ctx) => {
  ctx.resHeaders.set('Access-Control-Allow-Origin', '*');
};
