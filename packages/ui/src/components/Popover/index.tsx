import { cn } from '@/main';
import { Popover as BasePopover, PopoverContent, PopoverTrigger } from './base';
import { Popover as RadixUiPopver } from 'radix-ui';

type PopoverProps = {
  className?: string;
  trigger: React.ReactNode;
  open: boolean;
  children: React.ReactNode;
  onOpenChange?: (status: boolean) => void;
  side?: RadixUiPopver.PopoverContentProps['side'];
  sideOffset?: number;
  align?: RadixUiPopver.PopoverContentProps['align'];
};

export const Popover = ({ className, trigger, open, children, side, sideOffset, align, onOpenChange }: PopoverProps) => {
  return (
    <BasePopover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className={cn(className)} side={side} align={align} sideOffset={sideOffset}>
        {children}
      </PopoverContent>
    </BasePopover>
  );
};
