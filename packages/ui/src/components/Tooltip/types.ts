export type Orientation = 'top' | 'bottom' | 'left' | 'right';

export type TooltipProps = {
  className?: string;
  children: React.ReactElement;
  title?: React.ReactNode;
  orientation?: Orientation;
  /** 使用 tw-animate-css 动画，默认 false 只用 opacity transition */
  animate?: boolean;
};
