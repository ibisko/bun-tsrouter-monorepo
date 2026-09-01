import path from 'path';
import { promises as fs } from 'fs';

/** 确保指定的目录存在 */
export const fsEnsureMkdir = async (...paths: string[]) => {
  const dirPath = path.join(...paths);
  if (await fs.exists(dirPath)) return dirPath;
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
};

export const hashFile = async (
  file: Bun.BunFile | string | Uint8Array<ArrayBufferLike> | ArrayBufferLike | File,
  algorithm: Bun.SupportedCryptoAlgorithms = 'blake2b256',
) => {
  let bunFile;

  // string filePath
  if (typeof file === 'string') {
    bunFile = Bun.file(file);
  }

  // Bun.BunFile
  else if (file instanceof Blob) {
    bunFile = file;
  }

  // buffer
  else {
    return Bun.CryptoHasher.hash(algorithm, file).toHex();
  }

  const hasher = new Bun.CryptoHasher(algorithm);

  for await (const chunk of bunFile.stream()) {
    hasher.update(chunk);
  }

  return hasher.digest().toHex();
};

export const hashString = (data: Bun.BlobOrStringOrBuffer, algorithm: Bun.SupportedCryptoAlgorithms = 'blake2b256') => {
  return Bun.CryptoHasher.hash(algorithm, data).toHex();
};
