import prisma from '@/database/prisma';
import { Middleware, MiddlewareError } from '@packages/tsrouter/server';

class LimitRate {
  blackList = new Set<string>();

  limitIps: Map<string, number> = new Map();
  mapIps: Map<string, number> = new Map();
  timestampIndex: number;

  constructor(
    private readonly maxRequest: number = 200,
    private readonly timeWindow: number = 1e3 * 60,
  ) {
    const timestamp = Date.now();
    this.timestampIndex = ~~(timestamp / this.timeWindow);
  }

  trigger(ip: string) {
    const timestamp = Date.now();
    let limitIp = this.limitIps.get(ip);
    if (limitIp) {
      if (timestamp < limitIp) {
        throw new Error('limit rate!');
      }
      this.limitIps.delete(ip);
    }

    const timestampIndex = ~~(timestamp / this.timeWindow);
    if (timestampIndex !== this.timestampIndex) {
      this.timestampIndex = timestampIndex;
      this.mapIps.clear();
    }

    let _count = this.mapIps.get(ip) ?? 0;
    this.mapIps.set(ip, ++_count);

    if (_count > this.maxRequest) {
      this.limitIps.set(ip, timestamp + this.timeWindow);
      throw new Error('limit rate!');
    }
  }
}

export const limitRate = new LimitRate();

export const initLimitRate = async () => {
  const blackList = await prisma.blackList.findMany({ where: { deleted_at: null } });
  blackList.forEach(item => limitRate.blackList.add(item.ip));
};

export const trigger: Middleware = async (req, ctx) => {
  const ip = ctx.ip?.address;
  if (!ip) {
    throw new MiddlewareError({ message: 'ip no find!', status: 400, func: 'LimitRate' });
  }
  const exists = limitRate.blackList.has(ip);
  if (exists) {
    throw new MiddlewareError({
      message: '已被列入黑名单',
      func: 'trigger',
      status: 403,
    });
  }
  try {
    limitRate.trigger(ip);
  } catch (error) {
    throw new MiddlewareError({
      message: '已被列入黑名单',
      func: 'limit rate!',
      status: 429,
    });
  }
};
