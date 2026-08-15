import { cn } from '@/utils/cn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopoverContent } from './usePopoverContent';

type PopoverContentProps = {
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  triggerRect: DOMRect;
  top?: number;
  left?: number;
  side?: 'bottom' | 'top' | 'right' | 'left';
  align?: 'center' | 'start' | 'end';
  offset?: number;
  onClose: () => void;
};
export const PopoverContent = ({
  className,
  style,
  triggerRect,
  side,
  top: initTop,
  left: initLeft,
  align,
  offset = 6,
  children,
  onClose,
}: PopoverContentProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [closeBeforeAnimate, setCloseBeforeAnimate] = useState(false);

  const { top, left, translateX, translateY, halfTranslateX, halfTranslateY, setPosition } = usePopoverContent({
    triggerRect,
    side,
    align,
    offset,
    initTop,
    initLeft,
  });

  function onClickListener(e: PointerEvent) {
    const popoverDom = popoverRef.current;
    if (!popoverDom) return;
    const target = e.target as HTMLElement;
    if (popoverDom.contains(target)) return;
    setCloseBeforeAnimate(true);
  }

  useEffect(() => {
    setPosition();

    // 注意这里的 true：代表在捕获阶段触发
    document.addEventListener('click', onClickListener, true);
    return () => {
      document.removeEventListener('click', onClickListener, true);
    };
  }, []);

  useLayoutEffect(() => {
    // const popoverDom = popoverRef.current;
    // if (!popoverDom) return;
    // const popoverRect = popoverDom.getBoundingClientRect();
    // console.log(popoverRect.top, popoverRect.y);
    // todo 自动调整，避免溢出边界
    // console.log(window.innerWidth);
    // console.log(window.innerHeight);
    // 不论 side 是否存在，都要自动调整
  }, []);

  return createPortal(
    <div
      className={cn(
        'absolute',
        'fill-mode-forwards animation-duration-200',
        'animate-in zoom-in-95 fade-in-0',
        closeBeforeAnimate && 'animate-out zoom-out-95 fade-out-0',
        halfTranslateX && '-translate-x-1/2',
        halfTranslateY && '-translate-y-1/2',
        translateX && '-translate-x-full',
        translateY && '-translate-y-full',
        className,
      )}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        minWidth: `${triggerRect.width}px`,
        ...style,
      }}
      onAnimationEnd={e => {
        if (e.target !== e.currentTarget) return;
        if (closeBeforeAnimate) {
          setCloseBeforeAnimate(false);
          onClose();
        }
      }}
      ref={popoverRef}>
      {children}
    </div>,
    document.body,
  );
};
