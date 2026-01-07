import { procedure } from '@packages/tsrouter/server';
import { sse1, sse2, sse3 } from './sse';
import { get1, get2 } from './rest';
import { uploadFile1 } from './upload';

export const tsRouter = {
  get1: get1,
  get2: get2,

  sse1: sse1,
  sse2: sse2,
  sse3: sse3,

  upload1: procedure.uploadFile(uploadFile1),
};
