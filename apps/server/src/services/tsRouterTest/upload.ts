import path from 'path';
import { ServiceError } from '@packages/tsrouter/server';
import { hashFile } from '@packages/utils/server';

export const uploadFile1 = async (formData: FormData) => {
  let file = formData.get('file') as File;
  let hash = formData.get('hash') as string;
  if (!hash) {
    throw new ServiceError({ message: '缺少hash' });
  }
  if (!file) {
    throw new ServiceError({ message: '缺少file' });
  }

  const checkHash = hashFile(file, 'sha1');
  if (checkHash !== hash) {
    throw new ServiceError({ message: '文件hash不相同', data: { hash, checkHash } });
  }

  const tempSaveFilePath = path.join(process.cwd(), '__tmp', file.name);
  await Bun.write(tempSaveFilePath, file);
};
