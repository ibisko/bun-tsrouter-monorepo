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

export const hashFile = (file: File, algorithm: Bun.SupportedCryptoAlgorithms = 'sha1') => {
  const hashBuffer = Bun.CryptoHasher.hash(algorithm, file);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
