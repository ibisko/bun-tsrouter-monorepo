import { useCallback, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/main';
import { usePosition } from './usePosition';
import { useDismiss } from './useDismiss';
import type { PopoverSide, PopoverAlign } from './types';

type PopoverProps = {
  trigger: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
  side?: PopoverSide;
  sideOffset?: number;
  align?: PopoverAlign;
  children: ReactNode;
};

/**
 * 通用弹出层，自动定位，点击外部自动关闭。
 *
 * @example
 * ```tsx
 * <Popover trigger={<button>打开</button>} side="bottom" align="start">
 *   <div className="p-4">内容</div>
 * </Popover>
 * ```
 */
export const Popover = ({
  trigger,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  contentClassName,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  children,
}: PopoverProps) => {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const { containerRef, contentRef, position, visible, mounted } = usePosition({ side, sideOffset, align, open });
  const handleClose = useCallback(() => setOpen(false), [setOpen]);
  useDismiss(open, handleClose, containerRef, contentRef);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {mounted && createPortal(
        <div
          ref={contentRef}
          className={cn(
            'fixed z-50 transition-all duration-150',
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            contentClassName,
          )}
          style={{ top: position.top, left: position.left }}
          {...(visible ? {} : { inert: true })}
        >
          {children}
        </div>,
        document.body,
      )}
    </div>
  );
};
