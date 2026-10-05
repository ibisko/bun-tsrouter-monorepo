export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      port: string;
      DATABASE_URL: string;
      GITHUB_TOKEN: string;
      // iconify
      ROOT_DIR: string;
      PRETTIERRC_JSONFILE: string;
    }
  }
}
