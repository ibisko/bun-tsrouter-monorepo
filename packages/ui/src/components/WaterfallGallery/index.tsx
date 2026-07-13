import { cn } from '@packages/ui';
import { useRef } from 'react';
import { BoxItem } from './BoxItem';
import { useReachBottom } from './useReachBottom';
import { usePositions } from './usePositions';
import { useScrollTop } from './useScrollTop';

type WaterfallGalleryProps<T> = {
  className?: string;
  data: T[];
  render: (param: T, updateNodeHeight: (height: number) => void) => React.ReactNode;
  keyField?: string;
  total?: number;
  onReachBottom?: () => void;
};
/**
 * - 间距调整 `gap-4`
 * - 每行个数调整 `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
 */
export const WaterfallGallery = <T = any,>({ className, keyField = 'id', data, render, total, onReachBottom }: WaterfallGalleryProps<T>) => {
  const wrapperDomRef = useRef<HTMLDivElement>(null);

  // BoxItem 位置
  const { positions, contentHeight, updateNodeHeight } = usePositions(data, wrapperDomRef);
  // 滑动到底部触发 onReachBottom
  const { reachBottomRef, wrapperHeight } = useReachBottom({ data, total, wrapperDomRef, onReachBottom });
  const { scrollTop, setScrollTop } = useScrollTop();

  return (
    <div
      className={cn('relative overflow-auto', className)}
      ref={wrapperDomRef}
      onScroll={e => {
        const dom = e.target as HTMLDivElement;
        setScrollTop(dom.scrollTop);
      }}>
      {data.map((item, index) => {
        const pos = positions[index];
        // 不在可视区域就不挂载
        if (pos) {
          if (pos.top! + pos.height! < scrollTop) return;
          if (pos.top! > scrollTop + wrapperHeight) return;
        }
        return (
          <BoxItem pos={pos} indexKey={index} key={item[keyField as keyof typeof item] as number}>
            {render(item, height => updateNodeHeight(index, height))}
          </BoxItem>
        );
      })}
      <div style={{ height: `${contentHeight}px` }}></div>
      <div className="h-8" ref={reachBottomRef}></div>
    </div>
  );
};
