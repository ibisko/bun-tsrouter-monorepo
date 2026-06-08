export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      port: string;
      REDIS_URL: string;
      DATABASE_URL: string;
      AUTH_SECRET: string;
      REFRESH_AUTH_SECRET: string;

      LIMIT_RATE_MAX: string;
      LIMIT_RATE_TIME_WINDOW: string;
    }
  }
}
