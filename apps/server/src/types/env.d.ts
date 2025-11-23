export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      port: number;
      DATABASE_URL: string;
      authSecret: string;
      refreshAuthSecret: string;
    }
  }
}
