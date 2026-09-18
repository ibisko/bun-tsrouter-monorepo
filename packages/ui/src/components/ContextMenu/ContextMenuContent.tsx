import { computePosition, flip, ReferenceElement } from '@floating-ui/dom';
import { useLayer } from '@/hooks/useLayer';
import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Slot } from '@radix-ui/react-slot';

type ContextMenuContentProps = {
  className?: string;
  clientX: number;
  clientY: number;
  onClose: () => void;
  children: React.ReactNode;
  menus?: MenuItem[];
};

export const ContextMenuContent = ({ className, clientX, clientY, children, menus, onClose }: ContextMenuContentProps) => {
  const { ref: contentRef, isTargetInUpperLayer } = useLayer<HTMLDivElement>();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [closeBeforeAnimate, setCloseBeforeAnimate] = useState(false);

  function onClickListener(e: PointerEvent) {
    const contentEl = contentRef.current;
    if (!contentEl) return;
    const target = e.target as HTMLElement;
    if (contentEl.contains(target)) return;
    // 浮层记录
    if (isTargetInUpperLayer(target)) return;
    setCloseBeforeAnimate(true);
  }

  useEffect(() => {
    // Tooltip skip
    // 注意这里的 true：代表在捕获阶段触发
    document.addEventListener('click', onClickListener, true);
    return () => {
      document.removeEventListener('click', onClickListener, true);
    };
  }, []);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const virtualElement: ReferenceElement = {
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          top: clientY,
          left: clientX,
          bottom: clientY,
          right: clientX,
          x: clientX,
          y: clientY,
        };
      },
    };

    computePosition(virtualElement, contentRef.current, {
      placement: 'right-start',
      middleware: [
        // offset(4),
        flip(),
      ],
    }).then(({ x, y }) => {
      setPosition({ top: y, left: x });
    });
  }, [clientX, clientY]);

  return createPortal(
    <div
      ref={contentRef}
      className={cn(
        'absolute z-10',
        'fill-mode-forwards animation-duration-200',
        'animate-in zoom-in-95 fade-in-0',
        closeBeforeAnimate && 'animate-out zoom-out-95 fade-out-0',
        'bg-popover shadow-md p-1 rounded-lg text-popover-foreground ring-1 ring-foreground/15',
        'text-sm text-accent-foreground',
        className,
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onAnimationEnd={e => {
        if (e.target !== e.currentTarget) return;
        if (closeBeforeAnimate) {
          setCloseBeforeAnimate(false);
          onClose();
        }
      }}>
      {menus?.map(item =>
        item.render ? (
          <Slot>{item.render}</Slot>
        ) : (
          <div
            className="min-w-36 flex items-center px-1.5 py-1 rounded-md cursor-default hover:bg-accent"
            key={item.key}
            onClick={() => item.onClick?.(onClose)}>
            {item.prefix && <span>{item.prefix}</span>}
            <span>{item.title}</span>
            {item.suffix && <span className="ml-auto text-xs text-muted-foreground">{item.suffix}</span>}
          </div>
        ),
      )}

      {children}
    </div>,
    document.body,
  );
};

export type MenuItem = {
  key: React.Key;
  prefix?: React.ReactNode;
  title?: React.ReactNode;
  suffix?: React.ReactNode;
  onClick?: (hideMenu: () => void) => void;
  render?: React.ReactElement;
};
