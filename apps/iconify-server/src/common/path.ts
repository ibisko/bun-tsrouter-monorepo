import path from 'path';

/** 项目根目录 */
export const RootDir = path.join(process.cwd(), process.env.ROOT_DIR);

/** .prettierrc */
export const PrettierrcJsonFile = path.join(RootDir, process.env.PRETTIERRC_JSONFILE);
