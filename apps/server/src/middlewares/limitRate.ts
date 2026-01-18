import { sleep } from 'bun';
import { type Middleware, MiddlewareError } from '@packages/tsrouter/server';
import prisma from '@/database/prisma';
import redis from '@/database/redis';
import { addBlackList } from '@/services/blackList';
import { REDIS_KEY } from '@/common/enums';

/** 限流中间件 */
class LimitRate {
  max = +process.env.LIMIT_RATE_MAX || 1000;
  timeWindow = +process.env.LIMIT_RATE_TIME_WINDOW || 1e3 * 60;
  blackList = new Set();

  constructor() {
    this.runLoop();
  }

  async init() {
    const blackLists = await prisma.blackList.findMany({ select: { ip: true }, where: { deleted_at: null } });
    blackLists.forEach(item => this.blackList.add(item.ip));
  }

  async recordAddress(ip?: string) {
    if (!ip) {
      throw new MiddlewareError({ message: 'ip no find!', status: 400, func: 'LimitRate' });
    }
    if (this.blackList.has(ip)) {
      throw new MiddlewareError({ message: '已被列入黑名单', status: 403, func: 'LimitRate' });
    }

    const timestamp = new Date().getTime();
    const limitRateKey = `${REDIS_KEY.LIMIT_RATE}:${ip}`;
    const count = await redis.zcard(limitRateKey);

    // 检查超出数量
    if (count > this.max) {
      // 可以将被限流就加入黑名单
      await addBlackList(ip);
      await redis.zremrangebyscore(limitRateKey, 0, timestamp);
      throw new MiddlewareError({ message: 'limit-rate!', status: 429, func: 'LimitRate' });
    } else {
      await redis.zadd(limitRateKey, timestamp, timestamp);
    }
  }

  private async runLoop(): Promise<void> {
    const timestamp = new Date().getTime();
    const ips = await redis.keys(`${REDIS_KEY.LIMIT_RATE}:*`);

    for (const ip of ips) {
      const limitRateKey = `${REDIS_KEY.LIMIT_RATE}:${ip}`;
      await redis.zremrangebyscore(limitRateKey, 0, timestamp - this.timeWindow);
    }

    if (ips.length) {
      await sleep(1e3);
    } else {
      await sleep(this.timeWindow / 2);
    }
    return this.runLoop();
  }
}

export const limitRateInstance = new LimitRate();

export const limitRateMiddleware: Middleware = (_, ctx) => {
  limitRateInstance.recordAddress(ctx.ip?.address);
};
