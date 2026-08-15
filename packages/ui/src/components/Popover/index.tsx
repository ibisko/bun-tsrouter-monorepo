import { cn } from '@/utils/cn';
import { PopoverContent } from './popverContent';
import { usePopover } from './usePopover';
import { Slot } from '@radix-ui/react-slot';

type PopoverProps = {
  className?: string;
  trigger: React.ReactNode;
  side?: 'bottom' | 'top' | 'right' | 'left';
  align?: 'center' | 'start' | 'end';
  offset?: number;
  /** 箭头 icon */
  showArrow?: boolean;
  children: React.ReactNode;
};

// todo 提供 open, onChange 为非 trigger 情况
export const Popover = ({ className, trigger, side, align, offset, children }: PopoverProps) => {
  const { triggerRef, visible, onTrigger, ...props } = usePopover({ side, align, offset });

  return (
    <>
      <Slot ref={triggerRef} onClick={onTrigger}>
        {trigger}
      </Slot>

      {visible && (
        <PopoverContent
          className={cn('bg-popover/95 backdrop-blur-[2px] text-popover-foreground rounded-md shadow-md overflow-hidden p-1', className)}
          {...props}>
          {children}
        </PopoverContent>
      )}
    </>
  );
};
