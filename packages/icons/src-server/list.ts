import path from 'path';
import { parseIconFile } from './parseIconFile';
import { pick } from 'lodash-es';
import { IconsComponentsDir } from './utils';

type ListIconParam = {
  skip: number;
  take: number;
};
/** 分页列出本地的图标 */
// todo 自定义图标怎么办

export const scanLocalIconFile = () => Array.fromAsync(new Bun.Glob('*.tsx').scan({ cwd: IconsComponentsDir }));

/** 写入图标到本地 */
export const writeIcon = async (componentName: string, code: string) => {
  const fileName = `${componentName}.tsx`;
  const filePath = path.join(IconsComponentsDir, fileName);
  await Bun.file(filePath).write(code);

  // 列举导出文件，重写导出目录
  const exportComponents: string[] = [];

  const tsxFiles = new Bun.Glob('*.tsx').scan({ cwd: IconsComponentsDir });
  for await (const fileName of tsxFiles) {
    const regexp = /(.*)\.tsx/.exec(fileName);
    if (!regexp) continue;
    const keyName = regexp[1];
    console.log(keyName);
    exportComponents.push(`export * from './${keyName}'`);
  }

  const exportcode = exportComponents.join('\n');
  const indexTsFilePath = path.join(IconsComponentsDir, 'index.ts');
  await Bun.file(indexTsFilePath).write(exportcode);

  return filePath;
};
