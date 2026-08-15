import { useEffect, useRef, useState } from 'react';
import { getPosition } from './usePopoverContent';

type UsePopoverParam = {
  side?: 'bottom' | 'top' | 'right' | 'left';
  align?: 'center' | 'start' | 'end';
  offset?: number;
};
export const usePopover = ({ side, align, offset }: UsePopoverParam) => {
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [triggerRect, setTriggerRect] = useState<DOMRect>(new DOMRect());
  const triggerRef = useRef(null);

  const onTrigger = () => {
    if (!triggerRef.current) return;
    const dom = triggerRef.current as HTMLElement;
    const rect = dom.getBoundingClientRect();
    const pos = getPosition({ triggerRect: rect, side, align, offset });
    setTop(pos.top);
    setLeft(pos.left);
    setTriggerRect(rect);
    setVisible(true);
  };

  useEffect(() => {
    const triggerSpanDom = triggerRef.current;
    if (!triggerSpanDom) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (!visible) {
          setVisible(false);
          observer.disconnect();
        }
      },
      // { threshold, rootMargin },
    );

    observer.observe(triggerSpanDom);

    return () => observer.disconnect();
  }, []);

  function onClose() {
    setVisible(false);
  }

  return {
    visible,
    triggerRef,
    onTrigger,

    align,
    side,
    offset,
    top,
    left,
    triggerRect,
    onClose,
    setVisible,
  };
};
