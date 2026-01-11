import { merge } from 'lodash-es';
import { mainAuthRouter, mainWhiteListRouter } from './router/tsrouter';
import { limitRateInstance } from './middlewares/limitRate';
export type { AppRouter } from './router/tsrouter';
export * from 'prisma/generated/enums';

async function createServer() {
  // 403 黑名单
  // 429 限流
  // 400 凭证异常
  // 401 凭证过期
  // 400 参数错误
  // 400 service错误
  // 500 gateway才会收到的微服务错误

  // 初始化限流中间件，黑名单到内存
  await limitRateInstance.init();

  const server = Bun.serve({
    port: process.env.port,
    routes: merge(mainAuthRouter, mainWhiteListRouter),
    // maxRequestBodySize: 1024 ** 2 * 5, // 这里设置成5MB，默认是 128MB
    maxRequestBodySize: 1024 ** 2 * 5000, // 测试
    // hostname: '0.0.0.0',
    // ipv6Only
    reusePort: true, // 多个进程绑定到同一个端口的集群模式
  });
  console.log('server:', server.url.href);

  // todo 反向代理，需要从 X-Forwarded-For 头部获取真实 IP
}

async function main() {
  // 启动服务
  await createServer();
}

main();

// todo toad-cache
// todo @lukeed/ms
