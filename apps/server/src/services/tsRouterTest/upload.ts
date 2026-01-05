import path from 'path';
import { nanoid } from '@packages/utils';
import { UploadFileService } from '@packages/tsrouter/server';

export const uploadFile1: UploadFileService = async formData => {
  const file = formData.get('fileaaa');
  if (!file) throw new Error('Must upload a profile picture 1231231231!');
  const filePath = path.join('/Users/nnhu/Projects/base-project-templates/template-monorepo/apps/server', '__tmp', `${nanoid()}.bin`);
  await Bun.write(filePath, file);
  return { msg: 'success' };
};
