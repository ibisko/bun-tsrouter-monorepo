import { cn } from '@/main';
import { cloneElement, type MouseEvent, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type TooltipProps = {
  className?: string;
  children: React.ReactElement;
  title?: React.ReactNode;
  //   todo 追加更多位置
  orientation?: 'tm' | 'bm';
};

export const Tooltip = ({ className, title, orientation = 'tm', children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLElement>(null);
  const childProps = children.props as any;

  const onMouseEnter = (e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({
      top: rect.top + (orientation === 'tm' ? -8 : +8),
      left: rect.left + rect.width / 2,
    });
    setVisible(true);
    (childProps.onMouseEnter as ((e: MouseEvent) => void) | undefined)?.(e);
  };

  const onMouseLeave = () => {
    setVisible(false);
    (childProps.onMouseLeave as (() => void) | undefined)?.();
  };

  return (
    <>
      {cloneElement(children as React.ReactElement<any>, {
        ref,
        onMouseEnter,
        onMouseLeave,
      })}
      {createPortal(
        <div
          className={cn(
            'fixed top-0 left-0 z-50 px-2 py-1',
            'rounded text-sm bg-foreground text-background',
            'transition-opacity duration-150',
            { 'opacity-0 pointer-events-none': !visible },
            className,
          )}
          style={{
            transform: pos ? `translate(${pos.left}px,${pos.top}px) translateX(-50%)${orientation === 'tm' ? ' translateY(-100%)' : ''}` : undefined,
          }}>
          <span>
            <svg
              className={cn('absolute left-1/2 -translate-x-1/2 block z-50 size-2.5 rotate-45 rounded-[2px] bg-foreground fill-foreground', {
                '-top-1': orientation === 'bm',
                '-bottom-1': orientation === 'tm',
              })}
              width="10"
              height="5"
              viewBox="0 0 30 10"
              preserveAspectRatio="none">
              <polygon points="0,0 30,0 15,10" />
            </svg>
          </span>

          {title}
        </div>,
        document.body,
      )}
    </>
  );
};
