import path from 'path';
import { merge } from 'lodash-es';
import { mainAuthRouter, mainWhiteListRouter } from './router/tsrouter';
import { ensurePathExists } from './utils/path';
import { limitRateInstance } from './middlewares/limitRate';
export type { AppRouter } from './router/tsrouter';
export * from 'prisma/generated/enums';

const FastifyLogFolder = path.join(process.cwd(), '../../logs');

async function createServer() {
  // 403 黑名单
  // 429 限流
  // 400 凭证异常
  // 401 凭证过期
  // 400 参数错误
  // 400 service错误
  // 500 gateway才会收到的微服务错误

  await limitRateInstance.init();

  Bun.serve({
    port: process.env.port,
    routes: merge(mainAuthRouter, mainWhiteListRouter),
    // maxRequestBodySize: 1024 ** 2 * 5, // 这里设置成5MB，默认是 128MB
    maxRequestBodySize: 1024 ** 2 * 5000, // 测试
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
