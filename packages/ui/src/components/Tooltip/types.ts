import type { Placement } from '@/utils/floatingPosition';

export type { Placement as Orientation } from '@/utils/floatingPosition';

export type TooltipProps = {
  className?: string;
  children: React.ReactElement;
  title?: React.ReactNode;
  orientation?: Placement;
};
