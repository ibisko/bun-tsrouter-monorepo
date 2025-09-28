import path from 'path';
import fastify from 'fastify';
import config from './common/config';
import cors from '@fastify/cors';
import { getServerDirPath } from './utils/path';
import { mainAuthRouter, mainWhiteListRouter } from './router/tsrouter';
import z from 'zod';
export type { AppRouter } from './router/tsrouter';

async function main() {
  // 载入基本配置
  config.loadDefaultConfig();
  await config.loadSqliteConfig();

  // 初始化 fastify
  const app = fastify({
    logger: {
      formatters: {
        level(label) {
          return { level: label };
        },
        bindings() {
          return {};
        },
      },
      file: path.join(getServerDirPath(), '../../', 'logs', `dev.log`),
    },
    trustProxy: true, // 信任Nginx代理，拿到用户ip
  });

  app.register(cors, { origin: '*' });
  app.register(mainAuthRouter, { prefix: 'api' });
  app.register(mainWhiteListRouter, { prefix: 'api' });

  // 错误拦截
  app.setErrorHandler((error: any, req, reply) => {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ msg: z.prettifyError(error) });
    }
    reply.status(400).send();
  });

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
