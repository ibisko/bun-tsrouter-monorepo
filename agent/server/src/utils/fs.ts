import path from 'path';
import { minimatch } from 'minimatch';
import { readdirSync, statSync } from 'fs';

/**
 * 递归遍历文件目录
 * @param dir 指定目录
 * @param excludes 排除过滤掉的文件名
 */
export const readDirTree = (dir: string, excludes: string[] = []): any => {
  excludes.push('.DS_Store', 'node_module', 'dist');
  const dirs = [];
  const files = [];
  for (const item of readdirSync(dir)) {
    // 排除文件
    const some = excludes.some(e => minimatch(item, e));
    if (some) continue;
    const stat = statSync(path.join(dir, item));
    if (stat.isFile()) {
      files.push({
        type: 'file',
        name: item,
        filePath: path.join(dir, item),
      });
    } else if (stat.isDirectory()) {
      dirs.push({
        type: 'dir',
        name: item,
        filePath: path.join(dir, item),
        children: readDirTree(path.join(dir, item)),
      });
    }
  }
  return [...dirs, ...files];
};
