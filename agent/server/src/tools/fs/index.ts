/**
 * 此模块是通用文件树tool
 * 根据 .gitignore 排除一些目录
 * 读到多深合适
 * 注意区分软链就不要深入下去
 */

import { RootDir } from '@/common/path';
import { procedure } from '@packages/tsrouter/server';
import { existsSync, readdirSync, statSync } from 'fs';
import path from 'path';
import z from 'zod';

const readFilesSchema = z.object({
  dir: z.string().describe('指定目录'),
});

const readFiles = async (dir: string) => {
  const dirPath = path.resolve(RootDir, dir);
  if (!existsSync(dirPath)) throw new Error();
  if (!statSync(dirPath).isDirectory()) throw new Error();

  for (const item of readdirSync(dirPath)) {
    const absPath = path.join(dirPath, item);
    const file = Bun.file(absPath);
    const stat = await file.stat();

    console.log({
      isBlockDevice: stat.isBlockDevice, // 是否为块设备（如磁盘）
      isCharacterDevice: stat.isCharacterDevice, // 是否为字符设备（如终端）
      isDirectory: stat.isDirectory, // 是否为目录
      isFIFO: stat.isFIFO, // 是否为 FIFO/命名管道
      isFile: stat.isFile, // 是否为普通文件
      isSocket: stat.isSocket, // 是否为 Unix socket
      isSymbolicLink: stat.isSymbolicLink, // 是否为符号链接
    });
  }
};

const readFilesRouter = procedure.post(readFilesSchema, async ({ dir }, ctx) => {
  const files = await readFiles(path.join(RootDir, dir));
  return files;
});
