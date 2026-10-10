import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { useLayer } from '@/hooks/useLayer';

export type DialogContentProps = {
  className?: string;
  defaultWrapperClassName?: string;
  unuseDefaultWrapper?: boolean;
  title?: string;
  children: React.ReactNode;
};

type DialogContentInternalProps = DialogContentProps & {
  closeBeforeAnimate: boolean;
  setCloseBeforeAnimate: (status: boolean) => void;
  onExited: () => void;
};

export const DialogContent = ({
  className,
  defaultWrapperClassName,
  unuseDefaultWrapper,
  title,
  children,
  closeBeforeAnimate,
  setCloseBeforeAnimate,
  onExited,
}: DialogContentInternalProps) => {
  // 注册到浮层层栈：更早打开的浮层（如触发本 Dialog 的 Popover）不把本 Dialog 内的点击当作 outside
  const { ref: overlayRef } = useLayer();

  return createPortal(
    <div
      ref={overlayRef}
      className={cn(
        'fixed top-0 left-0 w-screen h-screen bg-background/20',
        'backdrop-blur-[2px]',
        'flex justify-center items-center',
        'fill-mode-forwards duration-200',
        'animate-in fade-in-0',
        closeBeforeAnimate && 'animate-out fade-out-0',
        className,
      )}
      onClick={e => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          setCloseBeforeAnimate(true);
        }
      }}
      onAnimationEnd={e => {
        if (e.target !== e.currentTarget) return;
        if (closeBeforeAnimate) {
          onExited();
        }
      }}>
      {unuseDefaultWrapper ? (
        children
      ) : (
        <div
          className={cn(
            'bg-popover border shadow-2xl p-4 rounded-md',
            'flex flex-col gap-2',
            'fill-mode-forwards duration-200',
            'animate-in zoom-in-95',
            closeBeforeAnimate && 'animate-out zoom-out-95',
            defaultWrapperClassName,
          )}>
          {title && <div className="text-xl font-black">{title}</div>}
          {children}
        </div>
      )}
    </div>,
    document.body,
  );
};
