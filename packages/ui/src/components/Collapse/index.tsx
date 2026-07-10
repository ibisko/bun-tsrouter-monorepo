import { cn } from '@/main';

type CollapseProps = {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  innerClassName?: string;
  onClick?: () => void;
};

/**
 * Grid 动画显隐组件，默认隐藏。
 * - JS 控制：传入 `open` prop
 * - CSS 控制：通过 className 传入 `grid-rows-[1fr] opacity-100`（如 `group-hover:grid-rows-[1fr] group-hover:opacity-100`）
 * - delay-0 group-hover:delay-1000
 */

export const Collapse = ({ children, className, open, innerClassName, onClick }: CollapseProps) => (
  <div
    className={cn(
      'grid overflow-hidden opacity-0 grid-rows-[0fr] transition-[opacity,grid-template-rows] w-full',
      open && 'grid-rows-[1fr] opacity-100',
      className,
    )}
    onClick={onClick}>
    <div className={cn('w-full min-h-0', innerClassName)}>{children}</div>
  </div>
);
