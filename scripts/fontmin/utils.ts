import path from 'path';
import { spawn } from 'child_process';
import { readdirSync, statSync } from 'fs';

export const exec = (cmd: string[], cwd?: string) =>
  new Promise(resolve => {
    const proc = spawn(cmd[0], cmd.slice(1), { cwd });
    proc.on('exit', resolve);
  });

/** 判断文件是否为非二进制的纯文本文件 */
const checkIsTextFile = async (filePath: string) => {
  // 检查是否包含 NULL 字节（二进制文件的典型特征）
  const buffer = await Bun.file(filePath).slice(0, 1024).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  if (bytes.includes(0)) return false;
  // 尝试作为 UTF-8 解码，捕获编码错误
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return true;
  } catch {
    return false;
  }
};

/** 迭代读取文件 */
export const readDirFiles = async (folders: string, callback: (filePath: string) => void) => {
  for (const name of readdirSync(folders)) {
    const item = path.join(folders, name);
    const stat = statSync(item);
    if (stat.isFile()) {
      const isTextFile = await checkIsTextFile(item);
      if (isTextFile) {
        callback(item);
      }
    } else if (stat.isDirectory()) {
      // 排除文件夹
      if (!['node_modules'].includes(item)) {
        readDirFiles(item, callback);
      }
    }
  }
};
