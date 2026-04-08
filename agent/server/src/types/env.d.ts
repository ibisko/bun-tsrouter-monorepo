export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      port: string;
      REDIS_URL: string;
      DATABASE_URL: string;
      GML_CODING_PLAN_BASE_URL: string;
      GML_CODING_PLAN_API_KEY: string;
      ROOT_DIR: string;
      ICONS_COMPONENTS_DIR: string;
      PRETTIERRC_JSONFILE: string;
    }
  }
}
