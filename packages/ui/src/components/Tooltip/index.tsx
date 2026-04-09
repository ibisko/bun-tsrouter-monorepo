import { cn } from '@/main';
import { cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { useTooltip } from './useTooltip';
import type { TooltipProps } from './types';

export const Tooltip = ({ className, title, orientation = 'top', children }: TooltipProps) => {
  const { visible, mounted, position, arrowOffset, onPointerEnter, onPointerLeave, contentRef } = useTooltip(orientation);
  const childProps = children.props as any;

  return (
    <>
      {cloneElement(children as React.ReactElement<any>, {
        onPointerEnter: (e: React.PointerEvent) => onPointerEnter(e, childProps),
        onPointerLeave: () => onPointerLeave(childProps),
      })}
      {mounted &&
        createPortal(
          <div
            ref={contentRef}
            role="tooltip"
            className={cn(
              'fixed z-50 px-2 py-1 rounded text-sm whitespace-nowrap',
              'bg-foreground text-background shadow-sm',
              'transition-opacity duration-150',
              visible ? 'opacity-100' : 'opacity-0',
              className,
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {/* 箭头 */}
            <span
              className={cn(
                'absolute size-2 bg-foreground shadow-sm pointer-events-none',
                orientation === 'top' && '-bottom-1',
                orientation === 'bottom' && '-top-1',
                orientation === 'left' && '-right-1',
                orientation === 'right' && '-left-1',
              )}
              aria-hidden
              style={{
                ...arrowOffset.style,
                transform: (orientation === 'top' || orientation === 'bottom')
                  ? 'translateX(-50%) rotate(45deg)'
                  : 'translateY(-50%) rotate(45deg)',
              }}
            />
            {title}
          </div>,
          document.body,
        )}
    </>
  );
};
