import { cn } from '@/main';
import { cloneElement, type MouseEvent, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Orientation = 'top' | 'bottom' | 'left' | 'right';

type TooltipProps = {
  className?: string;
  children: React.ReactElement;
  title?: React.ReactNode;
  orientation?: Orientation;
  /** 使用 tw-animate-css 动画，默认 false 只用 opacity transition */
  animate?: boolean;
};

const getPos = (rect: DOMRect, orientation: Orientation) => {
  const gap = 8;
  switch (orientation) {
    case 'top':
      return { top: rect.top - gap, left: rect.left + rect.width / 2, x: '-50%', y: '-100%' };
    case 'bottom':
      return { top: rect.bottom + gap, left: rect.left + rect.width / 2, x: '-50%', y: '0' };
    case 'left':
      return { top: rect.top + rect.height / 2, left: rect.left - gap, x: '-100%', y: '-50%' };
    case 'right':
      return { top: rect.top + rect.height / 2, left: rect.right + gap, x: '0', y: '-50%' };
  }
};

const DURATION = 200;
const SHOW_DELAY = 100;

export const Tooltip = ({ className, title, orientation = 'top', animate, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [transform, setTransform] = useState<string>();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const showTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const ref = useRef<HTMLElement>(null);
  const childProps = children.props as any;

  const onMouseEnter = useCallback(
    (e: MouseEvent) => {
      clearTimeout(timer.current);
      clearTimeout(showTimer.current);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const { top, left, x, y } = getPos(rect, orientation);
      setTransform(`translate(${left}px,${top}px) translate(${x},${y})`);
      showTimer.current = setTimeout(() => {
        setMounted(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      }, SHOW_DELAY);
      (childProps.onMouseEnter as ((e: MouseEvent) => void) | undefined)?.(e);
    },
    [orientation, childProps],
  );

  const onMouseLeave = useCallback(() => {
    setVisible(false);
    clearTimeout(showTimer.current);
    timer.current = setTimeout(() => setMounted(false), DURATION);
    (childProps.onMouseLeave as (() => void) | undefined)?.();
  }, [childProps]);

  return (
    <>
      {cloneElement(children as React.ReactElement<any>, {
        ref,
        onMouseEnter,
        onMouseLeave,
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
