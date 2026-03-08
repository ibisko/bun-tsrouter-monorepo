import path from 'path';
import { tmpdir } from 'os';
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { exec, readDirFiles } from './utils';

export const fontmin = async ({ folders, from, to }: FontminParam) => {
  if (typeof folders === 'string') {
    folders = [folders];
  }

  const cacheSet = new Set();
  // const extnameSet = new Set();
  for (const folder of folders) {
    readDirFiles(folder, filePath => {
      const extname = path.extname(filePath);
      // extnameSet.add(extname);
      if (!['.ts', '.tsx', '.js', '.jsx'].includes(extname)) return;
      readFileSync(filePath, 'utf-8')
        ?.split('')
        .filter(item => /\S+/.test(item))
        .map(item => cacheSet.add(item));
    });
  }
  // console.log(extnameSet);

  const content = [...cacheSet].join('');
  console.log(content.length);

  const extname = path.extname(from);
  const basename = path.basename(from, extname);
  const tempDir = mkdtempSync(path.join(tmpdir(), 'hb-subset-'));
  // 先把源文件复制过来，避免污染源路径
  const copyFile = path.join(tempDir, path.basename(from));
  copyFileSync(from, copyFile);

  if (extname.toLowerCase() !== '.ttf') {
    // woff2 转 ttf
    if (extname.toLowerCase() === '.woff2') {
      await exec(['woff2_decompress', copyFile], tempDir);
    }
    // todo 其他格式的字体文件转成ttf
  }

  const ttfFile = path.join(tempDir, `${basename}.ttf`);
  if (existsSync(ttfFile)) {
    const cacheFileTxt = path.join(tempDir, 'aaa.txt');
    writeFileSync(cacheFileTxt, content);
    const saveTTF = path.join(tempDir, 'xxx.ttf');
    await exec(['hb-subset', ttfFile, '--text-file', cacheFileTxt, '-o', saveTTF], tempDir);
    await exec(['woff2_compress', saveTTF], tempDir);
    const woffFile = path.join(tempDir, 'xxx.woff2');
    if (existsSync(woffFile)) {
      copyFileSync(woffFile, to);
    }
  }
  rmSync(tempDir, { recursive: true });
};

type FontminParam = {
  /**
   * 扫描指定文件夹里面的所有文件，提取全部字符作为子集
   * - 默认排除非纯文本的二进制文件
   * - 默认跳过 `node_modules` 文件夹
   */
  folders: string | string[];
  from: string;
  to: string;
};
