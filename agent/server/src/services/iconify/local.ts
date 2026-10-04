import z from 'zod';
import { procedure } from '@packages/tsrouter/server';
import { parseIconFile, reactCompoment, scanLocalIconFile, writeIcon } from '@packages/icons/server';
import { skipTaskTableSchema } from '@packages/utils/server';
import { prettierFormat } from '@/utils/prettier';

/** 列举本地icon */
const listLocalIcon = procedure.post(skipTaskTableSchema, async ({ skip, take }) => {
  const fileNames = await scanLocalIconFile();
  const total = fileNames.length;
  const icons = [];

  for (let i = 0; i < fileNames.length; i++) {
    if (i < skip) continue;
    const fileName = fileNames[i];
    const { viewBox, prefix, name, isAnimate, filePath } = await parseIconFile(fileName);
    // 自定义图标就没有 prefix 和 key，那怎么办
    icons.push({
      ...viewBox,
      name,
      prefix,
      sign: `${prefix}:${name}`,
      fileName,
      filePath,
      animate: isAnimate,
    });
    if (icons.length === take) break;
  }

  return {
    skip,
    take,
    total,
    data: icons,
  };
});

/** 查看本地icon代码 */
const listLocalIconInfo = procedure.post(
  z.object({
    filePaths: z.array(z.string()),
  }),
  async ({ filePaths }) => {
    const res = [];
    for (const item of filePaths) {
      const { raw, svgContent, viewBox, prefix, name, isAnimate, filePath } = await parseIconFile(item);
      res.push({
        content: raw,
        body: svgContent,
        ...viewBox,
        id: name,
        filePath,
        prefix,
        name,
        animate: isAnimate,
      });
    }
    return res;
  },
);

const reactCompomentSchema = z.object({
  sign: z.string(),
  body: z.string(),
  top: z.number(),
  left: z.number(),
  width: z.number(),
  height: z.number(),
});

/** icon 转成 react 代码 */
const reactCompomentRouter = procedure.post(reactCompomentSchema, async param => {
  console.log('reactCompomentRouter:', param);
  const { code, componentName, filePath } = await reactCompoment(param, code => prettierFormat(code, 'typescript'));
  return { componentName, filePath, code };
});

/** 添加新的icon */
const appendIcon = procedure.post(reactCompomentSchema, async param => {
  const { code, componentName } = await reactCompoment(param, code => prettierFormat(code, 'typescript'));
  const filePath = await writeIcon(componentName, code);
  return { filePath };
});

export const iconifyRouter = {
  listIcon: listLocalIcon,
  appendIcon: appendIcon,
  reactCompoment: reactCompomentRouter,
  listLocalIconInfo: listLocalIconInfo,
};
