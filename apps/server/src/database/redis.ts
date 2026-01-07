import Redis from 'ioredis';

export default new Redis({
  port: +process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});
