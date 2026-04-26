import { cn } from '@/main';

/**
 * Grid 动画显隐组件，默认隐藏。
 * - JS 控制：传入 `open` prop
 * - CSS 控制：通过 className 传入 `grid-rows-[1fr] opacity-100`（如 `group-hover:grid-rows-[1fr] group-hover:opacity-100`）
 */

export const Reveal = ({
  children,
  className,
  open,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  innerClassName?: string;
}) => (
  <div
    className={cn(
      'grid overflow-hidden opacity-0 grid-rows-[0fr] transition-[opacity,grid-template-rows]',
      open && 'grid-rows-[1fr] opacity-100',
      className,
    )}>
    <div className={cn('min-h-0', innerClassName)}>{children}</div>
  </div>
);
