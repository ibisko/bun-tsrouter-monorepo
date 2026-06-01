import { procedure, ServiceError } from '@packages/tsrouter/server';
import path from 'path';

export const putFile1Router = procedure.putFile(async (stream, ctx) => {
  const fileName = ctx.headers.get('X-FileName');
  if (!fileName) throw new ServiceError({ message: 'no fileName' });
  const writer = Bun.file(path.join(process.cwd(), '__tmp', fileName)).writer();
  for await (const chunk of stream) {
    await writer.write(chunk);
  }
  await writer.end();
});
