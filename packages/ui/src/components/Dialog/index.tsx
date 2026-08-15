import { cn } from '@packages/ui';
import { Slot } from '@radix-ui/react-slot';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type DialogProps = {
  className?: string;
  open?: boolean;
  onChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  defaultWrapperClassName?: string;
  children: React.ReactNode;
  unuseDefaultWrapper?: boolean;
  title?: string;
};

// todo 提供阻止点击背景关闭
export const Dialog = ({ className, trigger, children, open, onChange, title, unuseDefaultWrapper, defaultWrapperClassName }: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(open);
  useEffect(() => {
    setUncontrolledOpen(open);
  }, [open]);

  const [closeBeforeAnimate, setCloseBeforeAnimate] = useState(false);

  return (
    <>
      {trigger && (
        <Slot
          onClick={() => {
            setUncontrolledOpen(true);
          }}>
          {trigger}
        </Slot>
      )}

      {uncontrolledOpen &&
        createPortal(
          <div
            className={cn(
              'fixed top-0 left-0 w-screen h-screen bg-background/20 ',
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
                )}
                onAnimationEnd={e => {
                  if (e.target !== e.currentTarget) return;
                  if (closeBeforeAnimate) {
                    setCloseBeforeAnimate(false);
                    setUncontrolledOpen(false);
                    onChange?.(false);
                  }
                }}>
                {title && <div className="text-xl font-black">{title}</div>}
                {children}
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};
