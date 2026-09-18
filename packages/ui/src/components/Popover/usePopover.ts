import { useEffect, useRef, useState } from 'react';

type UsePopoverParam = {
  side?: 'bottom' | 'top' | 'right' | 'left';
  align?: 'center' | 'start' | 'end';
  offset?: number;
};
export const usePopover = <T extends HTMLElement = HTMLElement>({ side, align, offset }: UsePopoverParam) => {
  const [visible, setVisible] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect>(new DOMRect());
  const triggerRef = useRef<T>(null);

  const onTrigger = () => {
    if (!triggerRef.current) return;
    setTriggerRect(triggerRef.current.getBoundingClientRect());
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
    triggerRect,
    onClose,
    setVisible,
  };
};
