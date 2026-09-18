import { type WaterfallGalleryPosition } from './utils';

export type PositionStore = {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => WaterfallGalleryPosition;
  /** 返回 true 表示快照真变了(调用方据此标脏) */
  commit: (next: WaterfallGalleryPosition) => boolean;
};

/** 单项位置 store:useSyncExternalStore 三件套;返回 true 表示快照真变了(调用方据此标脏) */
export const createPositionStore = (height?: number): PositionStore => {
  const listeners = new Set<() => void>();
  let snapshot: WaterfallGalleryPosition = {
    height,
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return snapshot;
    },
    commit(next: WaterfallGalleryPosition) {
      const prev = snapshot;
      // 没变别换人:不通知,订阅者一个都不渲染
      if (prev.top === next.top && prev.left === next.left && prev.width === next.width && prev.height === next.height) return false;
      snapshot = next; // 换引用,React 才认得出"变了"
      listeners.forEach(l => l());
      return true;
    },
  };
};
