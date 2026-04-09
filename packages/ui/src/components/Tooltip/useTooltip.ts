import { type PointerEvent as RPointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { calcPosition } from '@/utils/floatingPosition';
import { dismissActive, register, unregister } from './singleton';
import type { Placement } from '@/utils/floatingPosition';

const SHOW_DELAY = 100;
const HIDE_DURATION = 150;

export const useTooltip = (orientation: Placement) => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowOffset, setArrowOffset] = useState<{ style: React.CSSProperties }>({ style: {} });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const clearTimeouts = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const hide = useCallback(() => {
    unregister(hide);
    setVisible(false);
    clearTimeouts();
    // 等关闭动画结束后卸载 DOM
    timers.current.push(setTimeout(() => setMounted(false), HIDE_DURATION));
  }, []);

  // 卸载时清理
  useEffect(() => () => {
    clearTimeouts();
    unregister(hide);
  }, [hide]);

  const onPointerEnter = useCallback(
    (e: RPointerEvent, childProps: any) => {
      dismissActive();
      clearTimeouts();

      triggerRef.current = e.currentTarget as HTMLElement;
      setMounted(true);

      // 等 DOM 渲染后计算位置
      timers.current.push(
        setTimeout(() => {
          const triggerRect = triggerRef.current?.getBoundingClientRect();
          const contentEl = contentRef.current;
          if (!triggerRect || !contentEl) return;
          const contentRect = contentEl.getBoundingClientRect();
          const pos = calcPosition(triggerRect, contentRect, orientation, 8, 'center');

          setPosition(pos);

          // 箭头偏移：让箭头始终指向触发器中心
          const arrowSize = 10; // size-2.5 = 10px
          const half = arrowSize / 2;
          const triggerCenter = {
            x: triggerRect.left + triggerRect.width / 2,
            y: triggerRect.top + triggerRect.height / 2,
          };
          const arrowStyle: React.CSSProperties = {};
          if (orientation === 'top' || orientation === 'bottom') {
            arrowStyle.left = Math.max(half, Math.min(triggerCenter.x - pos.left, contentRect.width - half));
          } else {
            arrowStyle.top = Math.max(half, Math.min(triggerCenter.y - pos.top, contentRect.height - half));
          }
          setArrowOffset({ style: arrowStyle });

          register(hide);
          requestAnimationFrame(() => setVisible(true));
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

  return { visible, mounted, position, arrowOffset, onPointerEnter, onPointerLeave, contentRef };
};
