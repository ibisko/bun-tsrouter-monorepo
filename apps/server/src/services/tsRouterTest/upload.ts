import path from 'path';
import { ServiceError } from '@packages/tsrouter/server';

export const uploadFile1 = async (formData: FormData) => {
  let file = formData.get('file') as File;
  let hash = formData.get('hash') as string;
  if (!file) {
    throw new ServiceError({ message: '没有文件啊' });
  }

  const hashBuffer = Bun.CryptoHasher.hash('sha1', file);
  const hashArray = new Uint8Array(hashBuffer);
  const checkHash = Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  if (checkHash !== hash) {
    throw new ServiceError({ message: '文件hash不相同' });
  }

  const tempSaveFilePath = path.join(process.cwd(), '__tmp', file.name);
  await Bun.write(tempSaveFilePath, file);
};
