import path from 'path';

export const RootDir = path.join(process.cwd(), process.env.ROOT_DIR);
export const IconsComponentsDir = path.join(RootDir, process.env.ICONS_COMPONENTS_DIR);
export const PrettierrcJsonFile = path.join(RootDir, process.env.PRETTIERRC_JSONFILE);
