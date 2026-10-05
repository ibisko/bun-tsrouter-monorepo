import { Cron } from 'croner';
import { syncIconSets } from './pull';

export const runCron = () => {
  syncIconSets();

  // 每日开始
  new Cron('0 0 0 * * *', () => {
    syncIconSets();
  });
};
