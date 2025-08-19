import path from 'path';
import fastify from 'fastify';
import config from './common/config';
import cors from '@fastify/cors';
import { demoAppRouter, demorouter } from './router/demo';
import { getServerDirPath } from './utils/path';
import type { ReplaceSpecificLeaf } from './router/demoTrpc';

// import { sleep } from '@packages/utils';
// import { format } from 'date-fns';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

async function main() {
  // 载入基本配置
  config.loadDefaultConfig();
  await config.loadSqliteConfig();

  // 初始化 fastify
  const app = fastify({
    logger: {
      // timestamp() {
      //   return `,"time":"${format(new Date(), 'yyyy/MM/dd hh:mm:ss')}"`;
      // },
      formatters: {
        level(label) {
          return { level: label };
        },
        bindings() {
          return {};
        },
      },
      // file: path.join(__dirname, '../../../', 'logs', `${format(new Date(), 'yyyy-MM-dd_hh:mm:ss')}.log`),
      file: path.join(getServerDirPath(), '../../', 'logs', `dev.log`),
    },
    trustProxy: true, // 信任Nginx代理，拿到用户ip
  });

  app.register(cors, { origin: '*' });
  app.register(demoAppRouter, { prefix: 'api' });

  // app.log.info('start');
  try {
    await app.listen({
      port: config.port,
      host: '0.0.0.0',
    });
    app.log.info('服务已开启');
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}
main();

export type AppRouter = ReplaceSpecificLeaf<typeof demorouter>;
