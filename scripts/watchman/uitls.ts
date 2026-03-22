import path from 'path';
import watchman from 'fb-watchman';

export const ROOT_DIR = path.join(__dirname, '../..');
export const DEFAULT_FILTERS = ['ts', 'cts', 'tsx', 'js', 'cjs', 'jsx'];

export const capabilityCheck = (client: watchman.Client) =>
  new Promise((resolve, reject) =>
    client.capabilityCheck({ optional: [], required: ['relative_root'] }, (error, resp) => (error ? reject(error) : resolve(resp))),
  );

export const getWatchProjectRelativePath = (client: watchman.Client, watchDir: string) =>
  new Promise<string | undefined>((resolve, reject) => {
    client.command(['watch-project', watchDir], (error, resp) => {
      if (error) {
        console.error('Error initiating watch:', error);
        return reject(error);
      }
      if ('warning' in resp) {
        console.warn('warning: ', resp.warning);
      }
      resolve(resp.relative_path);
    });
  });
