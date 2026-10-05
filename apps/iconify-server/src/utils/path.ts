import fs from 'fs';
import { retryHandle } from '@packages/utils';

/** 确保指定的目录存在 */
export const ensurePathExists = async (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    await retryHandle(
      () =>
        new Promise((resolve, reject) => {
          fs.mkdir(filePath, { recursive: true }, (err, path) => {
            if (err) {
              reject(err);
            } else {
              resolve(path);
            }
          });
        }),
    );
  }
};
