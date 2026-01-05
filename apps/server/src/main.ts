import path from 'path';
// import os from 'os';
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
    hostname: '0.0.0.0',
    routes: merge(mainAuthRouter, mainWhiteListRouter),
    // ipv6Only
  });

  // todo 反向代理，需要从 X-Forwarded-For头部获取真实 IP
}

async function main() {
  // const r = Object.values(os.networkInterfaces())
  //   .map(item => item)
  //   .flat()
  //   .filter(item => item?.family === 'IPv6' && !item.internal)
  //   .filter(item => !item?.address.startsWith('fe80::'))
  //   .map(item => ({ address: item?.address, mac: item?.mac }));
  // console.log(r);

  await ensurePathExists(FastifyLogFolder);
  // 启动服务
  await createServer();
}

main();


// todo toad-cache
// todo @lukeed/ms
