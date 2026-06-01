import { procedure } from '@packages/tsrouter/server';
import { sse1, sse2 } from './sse';
import { get1, get2 } from './rest';
import { uploadFile1 } from './upload';
import { downloadRouter } from './download';
import { postFormData1Router, postFormDataFileRouter } from './postFormData';
import { putFile1Router } from './putFile';

export const tsRouter = {
  get1: get1,
  get2: get2,

  sse1: sse1,
  sse2: sse2,

  upload1: procedure.postFormData(uploadFile1),
  download: downloadRouter,

  postFormData1: postFormData1Router,
  postFormDataFile: postFormDataFileRouter,

  putFile1: putFile1Router,
};
