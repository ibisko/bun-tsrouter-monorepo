import { Middleware } from '@packages/tsrouter/server';

export const cors: Middleware = (_, ctx) => {
  ctx.resHeaders.set('Access-Control-Allow-Origin', '*');
};
