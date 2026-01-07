export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      port: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      DATABASE_URL: string;
      authSecret: string;
      refreshAuthSecret: string;

      LIMIT_RATE_MAX: string;
      LIMIT_RATE_TIME_WINDOW: string;
    }
  }
}
