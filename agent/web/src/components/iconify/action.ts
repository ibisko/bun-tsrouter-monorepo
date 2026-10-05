import { throttle } from 'lodash-es';
import { IconifyApi } from './api';
import { Api } from '@/api';

// 请求队列与缓存是纯逻辑状态，不进 valtio store，避免无谓的响应式追踪
const pendingIDRequests: PendingItem<number, IconTableItem>[] = [];
const pendingLocalRequests: PendingItem<string, LocalIconTableItem>[] = [];
const cacheIDMap = new Map<number, IconTableItem>();
const cacheLocalIconMap = new Map<string, LocalIconTableItem>();

/**
 * 批量冲洗 pending 队列，每批最多 100 个：
 * 缓存命中直接返回，其余按 key 合并成一次查询；查询失败时以 undefined resolve，避免调用方永久挂起
 */
const flush = async <K, T>(pending: PendingItem<K, T>[], fetchMap: (keys: K[]) => Promise<Map<K, T>>, cache: Map<K, T>) => {
  while (pending.length) {
    const list = pending.splice(0, 100);
    const groups = new Map<K, PendingItem<K, T>[]>();
    for (const item of list) {
      const hit = cache.get(item.key);
      if (hit) {
        item.resolve(hit);
        continue;
      }
      const group = groups.get(item.key);
      if (group) group.push(item);
      else groups.set(item.key, [item]);
    }
    if (!groups.size) continue;

    try {
      const resMap = await fetchMap([...groups.keys()]);
      for (const [key, group] of groups) {
        const info = resMap.get(key);
        if (info) cache.set(key, info);
        group.forEach(item => item.resolve(info));
      }
    } catch (error) {
      console.error('flush icons failed:', error);
      for (const group of groups.values()) group.forEach(item => item.resolve());
    }
  }
};

/** 服务端按 id in 查询，返回与入参按 id 对应 */
const fetchIDMap = async (ids: number[]) => {
  const res = await IconifyApi.icon.getIcons.post({ icons: ids });
  return new Map<number, IconTableItem>(res.map(item => [item.id, item]));
};

/** 服务端按 filePaths 顺序逐个处理，返回与入参按下标对应 */
const fetchLocalMap = async (filePaths: string[]) => {
  const res = await Api.iconifyLocal.listLocalIconInfo.post({ filePaths });
  return new Map<string, LocalIconTableItem>(res.map((item, i) => [filePaths[i], item]));
};

const flushThrottled = throttle(
  () => {
    flush(pendingIDRequests, fetchIDMap, cacheIDMap);
    flush(pendingLocalRequests, fetchLocalMap, cacheLocalIconMap);
  },
  200,
  { leading: true, trailing: true },
);

type FetchIconParam = { id: number } | { fileName: string };

const getIconInfo = (param: FetchIconParam) => {
  return new Promise<IconTableItem | LocalIconTableItem | undefined>(resolve => {
    if ('id' in param) pendingIDRequests.push({ key: param.id, resolve });
    else pendingLocalRequests.push({ key: param.fileName, resolve });
    flushThrottled();
  });
};

export const iconifyAction = {
  getIconInfo,
};

type IconTableItem = Awaited<ReturnType<typeof IconifyApi.icon.getIcons.post>>[number];
type LocalIconTableItem = Awaited<ReturnType<typeof IconifyApi.iconifyLocal.listLocalIconInfo.post>>[number];

type PendingItem<K, T> = {
  key: K;
  resolve: (info?: T) => void;
};
