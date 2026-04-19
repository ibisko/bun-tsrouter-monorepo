import { cn } from '@/utils/cn';
import { Tooltip as BaseTooltip, TooltipContent, TooltipTrigger } from './base';
import { Tooltip as RadixUiTooltip } from 'radix-ui';
export { TooltipProvider } from './base';

export const Tooltip = ({ className, title, side = 'top', children }: TooltipProps) => {
  return (
    <BaseTooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={cn(className)}>
        {title}
      </TooltipContent>
    </BaseTooltip>
  );
};

type TooltipProps = {
  className?: string;
  children: React.ReactElement;
  title?: React.ReactNode;
  side?: RadixUiTooltip.TooltipContentProps['side'];
};
