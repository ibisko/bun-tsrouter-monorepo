import { type PointerEvent as RPointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { dismissActive, register, unregister } from './singleton';
import type { Orientation } from './types';

const DURATION = 200;
const SHOW_DELAY = 100;

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

export const useTooltip = (orientation: Orientation) => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [transform, setTransform] = useState<string>();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => timers.current.forEach(clearTimeout);

  const hide = useCallback(() => {
    unregister(hide);
    setVisible(false);
    clearTimeouts();
    timers.current.push(setTimeout(() => setMounted(false), DURATION));
  }, []);

  useEffect(() => () => {
    clearTimeouts();
    unregister(hide);
  }, [hide]);

  const onPointerEnter = useCallback(
    (e: RPointerEvent, childProps: any) => {
      dismissActive();
      clearTimeouts();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const { top, left, x, y } = getPos(rect, orientation);
      setTransform(`translate(${left}px,${top}px) translate(${x},${y})`);
      timers.current.push(
        setTimeout(() => {
          register(hide);
          setMounted(true);
          requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        }, SHOW_DELAY),
      );
      (childProps.onPointerEnter as ((e: RPointerEvent) => void) | undefined)?.(e);
    },
    [orientation, hide],
  );

  const onPointerLeave = useCallback(
    (childProps: any) => {
      hide();
      (childProps.onPointerLeave as (() => void) | undefined)?.();
    },
    [hide],
  );

  return { visible, mounted, transform, onPointerEnter, onPointerLeave, DURATION, hide };
};
