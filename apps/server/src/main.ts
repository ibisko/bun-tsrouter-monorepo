import path from 'path';
import { mainAuthRouter, mainWhiteListRouter } from './router/tsrouter';
import { ensurePathExists } from './utils/path';
import { merge } from 'lodash-es';
export type { AppRouter } from './router/tsrouter';
export * from 'prisma/generated/browser';

const FastifyLogFolder = path.join(process.cwd(), '../../logs');

async function createServer() {
  // 403 黑名单
  // 429 限流
  // 400 凭证异常
  // 401 凭证过期
  // 400 参数错误
  // 400 service错误
  // 500 gateway才会收到的微服务错误

  Bun.serve({
    port: process.env.port,
    routes: merge(mainAuthRouter, mainWhiteListRouter),
    // hostname: '0.0.0.0',
    // ipv6Only
  });

  // todo 反向代理，需要从 X-Forwarded-For 头部获取真实 IP
}

async function main() {
  await ensurePathExists(FastifyLogFolder);
  // 启动服务
  await createServer();
}

main();

// todo toad-cache
// todo @lukeed/ms
