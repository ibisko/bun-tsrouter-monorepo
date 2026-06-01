import { procedure, ServiceError } from '@packages/tsrouter/server';
import path from 'path';

export const postFormData1Router = procedure.postFormData((formData, ctx) => {
  const name = formData.get('name');
  if (name !== 'nnhu') throw new ServiceError({ message: 'name !== nnhu' });
  return { name, age: 12 };
});

export const postFormDataFileRouter = procedure.postFormData(async (formData, ctx) => {
  const file = formData.get('file') as File;
  if (!(file instanceof File)) throw new ServiceError({ message: 'name !== nnhu' });
  const writer = Bun.file(path.join(process.cwd(), '__tmp', file.name)).writer();
  for await (const chunk of file.stream()) {
    await writer.write(chunk);
  }
  await writer.end();
  return { fileName: file.name };
});
