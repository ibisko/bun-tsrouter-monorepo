import { appendIconRouter, listLocalIconRouter, viewIconFileRouter } from './local';
import { reactCompomentRouter } from './reactCompoment';

export const iconifyRouter = {
  local: {
    listIcon: listLocalIconRouter,
    appendIcon: appendIconRouter,
    reactCompoment: reactCompomentRouter,
    viewIconFile: viewIconFileRouter,
  },
};
