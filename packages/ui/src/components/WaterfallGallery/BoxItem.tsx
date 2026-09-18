import { cn } from '@/utils/cn';
import { useResizeObserver } from '@/main';
import { useRef, useSyncExternalStore } from 'react';
import { numToPx, type WaterfallGalleryPosition } from './utils';

type SyncExternalStore = typeof useSyncExternalStore<WaterfallGalleryPosition>;
type BoxItemProps<T> = {
  className?: string;
  subscribe: Parameters<SyncExternalStore>[0];
  getSnapshot: Parameters<SyncExternalStore>[1];
  item: T;
  index: number;
  render: (param: T) => React.ReactNode;
  onNodeHeight: (index: number, height: number) => void;
};

// 位置变化走 useSyncExternalStore 的订阅通知:一个 store 变只重渲染自己这一项,不惊动父组件和兄弟项
export const BoxItem = <T,>({ className, subscribe, getSnapshot, item, index, render, onNodeHeight }: BoxItemProps<T>) => {
  const position = useSyncExternalStore<WaterfallGalleryPosition>(subscribe, getSnapshot);
  const domRef = useRef<HTMLDivElement>(null);
  useResizeObserver(domRef, () => {
    if (!domRef.current) return;
    const height = domRef.current.getBoundingClientRect().height;
    if (!height) return; // 0 别上报:内容藏起来时会把布局压塌
    onNodeHeight(index, height);
  });

  return (
    <div
      ref={domRef}
      className={cn('absolute transition-[top,left,width,opacity]', className)}
      style={{
        top: numToPx(position?.top, 'auto'),
        left: numToPx(position?.left, 'auto'),
        width: numToPx(position?.width, 'auto'),
        opacity: position?.opacity ? `${position?.opacity}` : '0',
      }}>
      {render(item)}
    </div>
  );
};
