export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      port: string;
      REDIS_URL: string;
      DATABASE_URL: string;
      ROOT_DIR: string;
      ICONS_COMPONENTS_DIR: string;
      PRETTIERRC_JSONFILE: string;
      PROMPTS_DIR: string;

      GLM_BASE_URL: string;
      GLM_API_KEY: string;
      DEEPSEEK_URL: string;
      DEEPSEEK_API_KEY: string;
      GEMINI_URL: string;
      GEMINI_API_KEY: string;
      KIMI_URL: string;
      KIMI_API_KEY: string;
      YYDS_URL: string;
      YYDS_API_KEY: string;
      XIAOMI_MIMO_URL: string;
      XIAOMI_MIMO_API_KEY: string;
      GRSAI_API_KEY: string;
    }
  }
}
