import { procedure, ServiceError } from '@packages/tsrouter/server';
import path from 'path';
import z from 'zod';

const downloadSchema = z.object({
  fileName: z.string(),
});

export const downloadRouter = procedure.download(downloadSchema, async ({ fileName }, ctx) => {
  const filePath = path.join(process.cwd(), fileName);
  const file = Bun.file(filePath);
  const exist = await file.exists();
  if (!exist) throw new ServiceError({ message: '文件不存在' });
  const stat = await file.stat();
  ctx.resHeaders.set('content-length', `${stat.size}`);
  return file.stream();
});
