import { sleep } from 'bun';
import { type Middleware, MiddlewareError } from '@packages/tsrouter/server';

/** 限流器 */
class LimitRate {
  max = 1000;
  timeWindow = 1e3 * 60;

  private cacheAddress: { [k: string]: number[] } = {};
  private blackAddress: string[] = [];

  constructor() {
    this.autoReleaseCache();
  }

  recordAddress(address?: string) {
    if (!address) return;

    if (this.blackAddress.includes(address)) {
      throw new MiddlewareError({ message: '已被列入黑名单', status: 403, func: 'LimitRate' });
    }

    const timestamp = new Date().getTime();
    if (address in this.cacheAddress) {
      if (this.cacheAddress[address].length > this.max) {
        throw new MiddlewareError({ message: '限流', status: 429, func: 'LimitRate' });
      }

      this.cacheAddress[address].push(timestamp);
    } else {
      this.cacheAddress[address] = [timestamp];
    }

    // 检查超出数量
    if (this.cacheAddress[address].length > this.max) {
      // 可以将被限流就加入黑名单
      this.blackAddress.push(address);
      throw new MiddlewareError({ message: '限流', status: 429, func: 'LimitRate' });
    }
  }

  private async autoReleaseCache(): Promise<void> {
    const timestamp = new Date().getTime();
    const addressList = Object.keys(this.cacheAddress);

    for (const address of addressList) {
      this.cacheAddress[address] = this.cacheAddress[address].filter(item => item + this.timeWindow > timestamp);
      if (this.cacheAddress[address].length === 0) {
        delete this.cacheAddress[address];
      }
    }
    if (addressList.length) {
      await sleep(1e3);
    } else {
      await sleep(this.timeWindow);
    }
    return this.autoReleaseCache();
  }
}

const lr = new LimitRate();

export const limitRate: Middleware = (_, ctx) => {
  lr.recordAddress(ctx.ip?.address);
};
