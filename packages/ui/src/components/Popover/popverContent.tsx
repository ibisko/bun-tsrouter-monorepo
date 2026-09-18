import { cn } from '@/utils/cn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { arrow as arrowMiddleware, computePosition, flip, offset as offsetMiddleware, shift, size } from '@floating-ui/dom';
import type { Placement } from '@floating-ui/dom';
import { useLayer } from '@/hooks/useLayer';
import { PopoverArrow } from './arrow';

type PopoverContentProps = {
  className: string;
  children: React.ReactNode;
  triggerRect: DOMRect;
  side?: 'bottom' | 'top' | 'right' | 'left';
  align?: 'center' | 'start' | 'end';
  offset?: number;
  onClose: () => void;
  closeOnOutsideClick?: boolean;
  showArrow?: boolean;
};
export const PopoverContent = ({
  className,
  triggerRect,
  side,
  align,
  offset = 6,
  children,
  onClose,
  closeOnOutsideClick = true,
  showArrow = false,
}: PopoverContentProps) => {
  const { ref: popoverRef, isTargetInUpperLayer } = useLayer<HTMLDivElement>();
  const [closeBeforeAnimate, setCloseBeforeAnimate] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);
  // placement 是 flip 之后的实际边；arrow 是箭头中心的坐标
  const [position, setPosition] = useState<{ x: number; y: number; placement: Placement; arrow?: { x?: number; y?: number } } | null>(null);

  function onClickListener(e: PointerEvent) {
    const popoverDom = popoverRef.current;
    if (!popoverDom) return;
    const target = e.target as HTMLElement;
    if (popoverDom.contains(target)) return;
    // 浮层记录
    if (isTargetInUpperLayer(target)) return;
    setCloseBeforeAnimate(true);
  }

  useEffect(() => {
    // Tooltip skip
    if (!closeOnOutsideClick) return;
    // 注意这里的 true：代表在捕获阶段触发
    document.addEventListener('click', onClickListener, true);
    return () => {
      document.removeEventListener('click', onClickListener, true);
    };
  }, []);

  useLayoutEffect(() => {
    const popoverDom = popoverRef.current;
    if (!popoverDom) return;

    const virtualTrigger = { getBoundingClientRect: () => triggerRect };
    computePosition(virtualTrigger, popoverDom, {
      placement: `${side ?? 'bottom'}${align && align !== 'center' ? `-${align}` : ''}` as Placement,
      strategy: 'fixed',
      middleware: [
        offsetMiddleware(showArrow ? 7 : offset),
        flip(),
        shift({ padding: 8 }),
        // 高度上限锁定在可视区域内，超出时由调用方的 overflow 滚动
        size({
          padding: 8,
          apply({ availableHeight, elements }) {
            elements.floating.style.maxHeight = `${availableHeight}px`;
          },
        }),
        ...(showArrow && arrowRef.current ? [arrowMiddleware({ element: arrowRef.current })] : []),
      ],
    }).then(({ x, y, placement, middlewareData }) => {
      setPosition({ x, y, placement, arrow: middlewareData.arrow });
    });
  }, []);

  return createPortal(
    <div
      className={cn(
        'fixed',
        'fill-mode-forwards animation-duration-200',
        'animate-in zoom-in-95 fade-in-0',
        closeBeforeAnimate && 'animate-out zoom-out-95 fade-out-0',
        className,
      )}
      style={{
        top: `${position?.y ?? 0}px`,
        left: `${position?.x ?? 0}px`,
        visibility: position ? undefined : 'hidden',
        // minWidth: `${triggerRect.width}px`,
        // ...style,
      }}
      onAnimationEnd={e => {
        if (e.target !== e.currentTarget) return;
        if (closeBeforeAnimate) {
          setCloseBeforeAnimate(false);
          onClose();
        }
      }}
      ref={popoverRef}>
      {showArrow && <PopoverArrow ref={arrowRef} position={position} />}
      {children}
    </div>,
    document.body,
  );
};
