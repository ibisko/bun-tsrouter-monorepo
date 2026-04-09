import { useCallback, useEffect, useRef, useState } from 'react';
import { calcPosition } from '@/utils/floatingPosition';
import type { PopoverAlign, PopoverSide } from './types';

type UsePositionOptions = {
  side: PopoverSide;
  sideOffset: number;
  align: PopoverAlign;
  open: boolean;
};

export function usePosition({ side, sideOffset, align, open }: UsePositionOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updatePosition = useCallback(() => {
    const trigger = containerRef.current?.firstElementChild as HTMLElement | null;
    const content = contentRef.current;
    if (!trigger || !content) return;

    setPosition(calcPosition(trigger.getBoundingClientRect(), content.getBoundingClientRect(), side, sideOffset, align));
  }, [side, sideOffset, align]);

  // 打开/关闭：统一管理 mounted、visible、位置计算
  useEffect(() => {
    if (open) {
      clearTimeout(closeTimerRef.current);
      setMounted(true);
      requestAnimationFrame(() => {
        updatePosition();
        requestAnimationFrame(() => setVisible(true));
      });
    } else if (visible) {
      setVisible(false);
      closeTimerRef.current = setTimeout(() => setMounted(false), 150);
    } else {
      setMounted(false);
    }

    return () => clearTimeout(closeTimerRef.current);
  }, [open, visible, updatePosition]);

  // 滚动/resize 时重新计算
  useEffect(() => {
    if (!open) return;
    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [open, updatePosition]);

  return { containerRef, contentRef, position, visible, mounted };
}
