import type { Client, SubscriptionConfig, WatchProjectResponse, SubscribeResponse } from 'fb-watchman';

/** 仅负责 watchman 的主要操作 */
export class WatchmanClient {
  constructor(private readonly client: Client) {}

  /** 确认服务存活 */
  capabilityCheck() {
    return new Promise((resolve, reject) =>
      this.client.capabilityCheck({ optional: [], required: ['relative_root'] }, (error, resp) => {
        error ? reject(error) : resolve(resp);
      }),
    );
  }

  /**
   * 从传入的目录向上查找，直到首个包含 .watchmanconfig 的目录被认为是项目根
   * 一路找到头都没有，就会把当前传的目录自己当根
   */
  watchProject(dirPath: string) {
    return new Promise<WatchProjectResponse>((resolve, reject) => {
      this.client.command(['watch-project', dirPath], (error, resp) => {
        error ? reject(error) : resolve(resp);
      });
    });
  }

  /** 订阅监听的目录 */
  async subscribe(dirPath: string, subscriptionName: string) {
    const resp = await this.watchProject(dirPath);
    if ('warning' in resp) {
      console.warn('watchProject Warn::', resp.warning);
      return;
    }
    const relativePath = resp.relative_path!;
    const sub: SubscriptionConfig = {
      expression: ['suffix', ['ts', 'cts', 'tsx', 'js', 'cjs', 'jsx']],
      fields: ['name', 'size', 'exists', 'type'],
      relative_root: relativePath,
    };
    return await new Promise<SubscribeResponse>((resolve, reject) => {
      this.client.command(['subscribe', resp.watch, subscriptionName, sub], (error, resp) => {
        error ? reject(error) : resolve(resp);
      });
    });
  }
}
