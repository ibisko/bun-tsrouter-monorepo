import { grsaiGptImage2Router } from './gptImage2';
import { grsaiNanobanaaRouter } from './nanobanana';

export const imageRouter = {
  gptImage2: {
    grsai: grsaiGptImage2Router,
  },
  nanobanana: {
    grsai: grsaiNanobanaaRouter,
  },
};
