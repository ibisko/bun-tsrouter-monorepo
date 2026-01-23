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

export const hashFile = async (
  file: Bun.BunFile | string | Uint8Array<ArrayBufferLike> | ArrayBufferLike,
  algorithm: Bun.SupportedCryptoAlgorithms = 'sha1',
) => {
  let buffer;
  if (typeof file === 'string') {
    file = Bun.file(file);
    buffer = await file.arrayBuffer();
  } else if (file instanceof Blob) {
    // Bun.BunFile
    buffer = await file.arrayBuffer();
  } else {
    buffer = file;
  }
  return Bun.CryptoHasher.hash(algorithm, buffer).toHex();
};
