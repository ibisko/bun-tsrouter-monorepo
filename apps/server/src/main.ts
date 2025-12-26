import path from 'path';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { mainAuthRouter, mainWhiteListRouter } from './router/tsrouter';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyMultipart from '@fastify/multipart';
import { MiddlewareError, ServiceError, ValidationError } from '@packages/tsrouter/server';
import { ensurePathExists } from './utils/path';
export type { AppRouter } from './router/tsrouter';
export * from 'prisma/generated/browser';
// import { Context as BaseContext } from '@packages/tsrouter/server';

const FastifyLogFolder = path.join(process.cwd(), '../../logs');

async function createServer() {
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
      file: path.join(FastifyLogFolder, 'dev.log'),
    },
    trustProxy: true, // 信任Nginx代理，拿到用户ip
  });

  // 跨域
  app.register(cors, { origin: '*' });

  // 黑名单
  // app.addHook('onRequest', blackListHook);

  // 限流
  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: 1e3 * 60,
    /* errorResponseBuilder(req, context) {
      return {
        statusCode: 429, error: 'Too Many Requests', message: `Rate limit exceeded, retry in ${context.after}`
      }
    }, */
  });

  // 文件上传
  app.register(fastifyMultipart);

  app.register(mainAuthRouter, { prefix: 'api' });
  app.register(mainWhiteListRouter, { prefix: 'api' });

  // 错误拦截
  app.setErrorHandler((error: any, req, reply) => {
    // 限流
    if (error.statusCode === 429) {
      // try {
      //   blackList.add(req.ip);
      // } catch (error) { }
      // return reply.code(403).send('已被列入黑名单');
      return reply.code(429).send('限流');
    }
    console.log('错误拦截到了');

    // 403 黑名单
    // 429 限流
    // 400 凭证异常
    // 401 凭证过期
    // 400 参数错误
    // 400 service错误
    // 500 gateway才会收到的微服务错误

    if (error instanceof MiddlewareError || error instanceof ValidationError || error instanceof ServiceError) {
      return reply.status(error.status).send({ msg: error.message });
    }
  });

  try {
    await app.listen({
      port: process.env.port,
      host: '0.0.0.0',
    });
    console.log('服务已开启');
    app.log.info('服务已开启');
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

async function main() {
  await ensurePathExists(FastifyLogFolder);
  // 启动服务
  await createServer();
}

main();
