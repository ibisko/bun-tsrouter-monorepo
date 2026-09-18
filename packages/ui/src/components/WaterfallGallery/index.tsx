import { cn } from '@/utils/cn';
import { BoxItem } from './BoxItem';
import { useWaterfallLayout } from './useWaterfallLayout';
import { useMergedRefs } from '@/hooks/useMergedRefs';

type WaterfallGalleryProps<T> = Omit<React.ComponentProps<'div'>, 'onScroll'> & {
  data: T[];
  keyField?: string;
  render: (param: T) => React.ReactNode;
  /** 页面级滚动:挂 body/window 上滚;false(默认)组件自己是 overflow-auto 滚动容器 */
  pageScroll?: boolean;
  /** 滚动区末尾的插槽:内容由消费方定(loading/到底提示/null),组件只提供位置 */
  foot?: React.ReactNode;
};

/**
 * 仅负责虚拟滚动，布局控制
 * - 每行个数调整 `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
 * - 间距调整 `gap-4`
 */
export const WaterfallGallery = <T = any,>({
  data,
  keyField = 'id',
  pageScroll,
  foot,
  render,
  className,
  ref,
  ...props
}: WaterfallGalleryProps<T>) => {
  // 测量/布局/可视集合全在 useWaterfallLayout:父组件只管渲染
  const { wrapperDomRef, content, contentHeight, updateNodeHeight, setContentHandle } = useWaterfallLayout(data, keyField, pageScroll);
  const wrapperRef = useMergedRefs(ref, wrapperDomRef);

  return (
    <div
      {...props}
      className={cn('relative', !pageScroll && 'overflow-auto', className)}
      onScroll={pageScroll ? undefined : setContentHandle}
      ref={wrapperRef}>
      {content.map(({ item, index, pos, key }) => (
        <BoxItem
          subscribe={pos.subscribe}
          getSnapshot={pos.getSnapshot}
          item={item}
          index={index}
          render={render}
          onNodeHeight={updateNodeHeight}
          key={key}
        />
      ))}

      <div style={{ height: `${contentHeight}px` }} />

      {foot}
    </div>
  );
};
