import { cn } from '@/utils/cn';
import { Tooltip as RadixUiTooltip } from 'radix-ui';
import { usePopover } from '../Popover/usePopover';
import { Slot } from '@radix-ui/react-slot';
import { PopoverContent } from '../Popover/popverContent';
import { useMergedRefs } from '@/hooks/useMergedRefs';

export const Tooltip = ({ className, title, children, ref, ...tooltipProps }: TooltipProps) => {
  const { triggerRef, visible, onTrigger, onClose, ...props } = usePopover({});
  const slotRef = useMergedRefs(ref, triggerRef);

  return (
    <>
      <Slot onMouseEnter={onTrigger} onMouseLeave={onClose} {...tooltipProps} ref={slotRef}>
        {children}
      </Slot>

      {visible && (
        <PopoverContent
          className={cn(
            'z-50 bg-foreground backdrop-blur-[2px] text-background text-sm rounded-sm shadow-md px-2 py-0.5 overflow-visible',
            className,
          )}
          onClose={onClose}
          closeOnOutsideClick={false}
          showArrow
          {...props}>
          {title}
        </PopoverContent>
      )}
    </>
  );
};

type TooltipProps = React.ComponentProps<'div'> & {
  className?: string;
  children: React.ReactElement;
  title?: React.ReactNode;
  side?: RadixUiTooltip.TooltipContentProps['side'];
};
