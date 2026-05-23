import path from 'path';

/** 项目根目录 */
export const RootDir = path.join(process.cwd(), process.env.ROOT_DIR);

/** icons目录 */
export const IconsComponentsDir = path.join(RootDir, process.env.ICONS_COMPONENTS_DIR);

/** .prettierrc */
export const PrettierrcJsonFile = path.join(RootDir, process.env.PRETTIERRC_JSONFILE);

/** prompts */
export const PromptsDir = path.join(RootDir, process.env.PROMPTS_DIR);
