import { procedure } from '@packages/tsrouter/server';
import { sse1, sse1Schema, sse2, sse3 } from './sse';
import { get1, get2, get2Schema } from './rest';

export const tsRouter = {
  get1: procedure.get(get1),
  get2: procedure.get(get2Schema, get2),

  sse1: procedure.sse(sse1Schema, sse1),
  sse2: procedure.sse(sse2),
  sse3: procedure.sse(sse1Schema, sse3),
};
