import path from 'path';
import fs from 'fs';

/** 确保指定的目录存在 */
export const fsEnsureMkdir = async (...paths: string[]) => {
  const dirPath = path.join(...paths);
  if (fs.existsSync(dirPath)) return;
  await new Promise((resolve, reject) =>
    fs.mkdir(dirPath, { recursive: true }, err => {
      if (err) {
        reject(err);
      } else {
        resolve(null);
      }
    }),
  );
};
