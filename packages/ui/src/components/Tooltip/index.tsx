import { cn } from '@/main';
import { cloneElement, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTooltip } from './useTooltip';
import type { TooltipProps } from './types';

export const Tooltip = ({ className, title, orientation = 'top', animate, children }: TooltipProps) => {
  const { visible, mounted, transform, onPointerEnter, onPointerLeave, DURATION } = useTooltip(orientation);
  const ref = useRef<HTMLElement>(null);
  const childProps = children.props as any;

  return (
    <>
      {cloneElement(children as React.ReactElement<any>, {
        ref,
        onPointerEnter: (e: React.PointerEvent) => onPointerEnter(e, childProps),
        onPointerLeave: () => onPointerLeave(childProps),
      })}
      {mounted &&
        createPortal(
          <div
            className={cn(
              'fixed top-0 left-0 z-50 px-2 py-1',
              'rounded text-sm bg-foreground text-background',
              animate
                ? [visible ? 'animate-in fade-in' : 'animate-out fade-out', 'duration-500']
                : ['transition-opacity', { 'opacity-0 pointer-events-none': !visible }],
              className,
            )}
            style={{
              transform,
              transitionDuration: animate ? undefined : `${DURATION}ms`,
            }}>
            <svg
              className={cn(
                'absolute z-50 size-2.5 rounded-[2px] bg-foreground fill-foreground rotate-45',
                { 'left-1/2 -bottom-1 -translate-x-1/2': orientation === 'top' },
                { 'left-1/2 -top-1 -translate-x-1/2': orientation === 'bottom' },
                { 'top-1/2 -right-1 -translate-y-1/2': orientation === 'left' },
                { 'top-1/2 -left-1 -translate-y-1/2': orientation === 'right' },
              )}
              width="10"
              height="5"
              viewBox="0 0 30 10"
              preserveAspectRatio="none">
              <polygon points="0,0 30,0 15,10" />
            </svg>
            {title}
          </div>,
          document.body,
        )}
    </>
  );
};
