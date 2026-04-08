/**
 * 仅适合 icons/src/components 里面只有一级文件，不支持有多层文件夹
 */

import path from 'path';
import { parseIconFile } from './parseIconFile';
import { reactCompoment } from './reactCompoment';
import { Context, procedure, ServiceError } from '@packages/tsrouter/server';
import { IconsComponentsDir } from '@/common/path';
import { iconIncoSchema, IconInfo } from '@packages/icons';
import z from 'zod';

// todo 灵活的相对路径匹配

class LocalIconsComponents {
  async scanTsxFiles() {
    const icons: ScanLocalIconInfo[] = [];

    await this.scanTsxFile(async filePath => {
      const { viewBox, body, prefix, key, isAnimate } = await parseIconFile(filePath);
      icons.push({
        top: viewBox.top,
        left: viewBox.left,
        width: viewBox.width,
        height: viewBox.height,
        prefix,
        key,
        body,
        isAnimate,
        filePath,
      });
    });

    return icons;
  }

  private async scanTsxFile(cb: (filePath: string, fileName: string) => Promise<void>) {
    const tsxFiles = new Bun.Glob('*.tsx').scan({ cwd: IconsComponentsDir });
    for await (const fileName of tsxFiles) {
      const filePath = path.join(IconsComponentsDir, fileName);
      await cb(filePath, fileName);
    }
  }

  private async rewriteExports() {
    const exportComponents: string[] = [];
    await this.scanTsxFile(async (_, fileName) => {
      console.log(fileName);
      const regexp = /(.*)\.tsx/.exec(fileName);
      if (!regexp) return;
      const keyName = regexp[1];
      console.log(keyName);
      exportComponents.push(`export * from './${keyName}'`);
    });
    const code = exportComponents.join('\n');
    const indexTsFilePath = path.join(IconsComponentsDir, 'index.ts');
    await Bun.file(indexTsFilePath).write(code);
  }

  async appendIcon(icon: IconInfo) {
    const { code, fileName } = await reactCompoment(icon);
    const filePath = path.join(IconsComponentsDir, fileName);
    await Bun.file(filePath).write(code);
    await this.rewriteExports();
    return filePath;
  }
}

const localIconsComponents = new LocalIconsComponents();

export const listLocalIconRouter = procedure.get(async () => {
  return await localIconsComponents.scanTsxFiles();
});

export const appendIconRouter = procedure.post(iconIncoSchema, async (param, ctx: Context) => {
  const filePath = await localIconsComponents.appendIcon(param);
  return { filePath };
});

const viewIconFileSchema = z.object({
  filePath: z.string(),
});
export const viewIconFileRouter = procedure.get(viewIconFileSchema, async (param, ctx) => {
  const file = Bun.file(param.filePath);
  const exists = await file.exists();
  if (!exists) throw new ServiceError({ message: 'file no exists' });
  const code = await file.text();
  const fileName = path.basename(param.filePath);
  return { code, fileName };
});

type ScanLocalIconInfo = IconInfo & {
  filePath: string;
};
