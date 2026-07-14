import { BunServeHandler, Middleware } from '@packages/tsrouter/server';

export const corsMiddleware: Middleware = (_, ctx) => {
  ctx.resHeaders.set('Access-Control-Allow-Origin', '*');
};

export const optionsService: BunServeHandler | undefined = true
  ? () => {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,X-Cos-Meta');
    return new Response(null, { status: 204, headers });
  }
  : undefined;
