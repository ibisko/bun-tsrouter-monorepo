// import keyv from './database/keyv';
import Redis from 'ioredis';

~(async function () {
  const redis = new Redis({ port: 6379 });

  // const IP = '192.168.0.1';
  const IP = '192.168.0.2';
  const KEY = `limit-rate:${IP}`;
  const timestamp = new Date().getTime();

  const res = await redis.keys('limit-rate:*');
  console.log(res);
  for (const key of res) {
    const r = await redis.zscan(key, 0);
    console.log(r);
    // await redis.zremrangebyscore(key, 0, timestamp - 1e3 * 60);
  }
  return;

  // 统计数量
  const count = await redis.zcard(KEY);
  console.log({ count });
  if (count >= 1000) {
    return;
  }
  // 移除60s之前的
  // await redis.zremrangebyscore(KEY, 0, timestamp - 1e3 * 60);
  await redis.zadd(KEY, timestamp, timestamp);
  const list = await redis.zscan(KEY, timestamp);
  console.log(list);

  // const cacheIps = [{ timestamp: 'jsldjfklskd' }];
  // await keyv.set(KEY, cacheIps);
  // // console.log(await keyv.get(`limit-rate-ip:*`));
  // console.log(await keyv.get(`limit-rate-ip:`));
  // console.log(await keyv.getMany([KEY]));

  // Bun.CryptoHashInterface.hash(null,"hex")
  // Bun.CryptoHasher.hash("md5")
})();
