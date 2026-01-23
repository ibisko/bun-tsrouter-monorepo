import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/main';
import { sleep } from '@packages/utils';

type DialogProps = {
  className?: string;
  children: React.ReactNode;
  open: boolean;
  cancel: () => void;
};
export const Dialog = ({ className, open, children, cancel }: DialogProps) => {
  const [visible, setVisible] = useState(false);
  const [destory, setDestory] = useState(false);
  useEffect(() => {
    if (open) {
      setDestory(open);
      requestAnimationFrame(() =>
        requestAnimationFrame(async () => {
          setVisible(open);
        }),
      );
    } else {
      requestAnimationFrame(() =>
        requestAnimationFrame(async () => {
          setVisible(open);
          await sleep(500);
          setDestory(open);
        }),
      );
    }
  }, [open]);

  return (
    <>
      {destory
        ? createPortal(
            <div
              className={cn('fixed top-0 left-0 w-screen h-screen bg-background/50 transition duration-300', visible ? 'opacity-100' : 'opacity-0')}>
              <div className={cn('absolute top-0 left-0 w-screen h-screen')} onClick={cancel}></div>
              <div className={cn('fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-4 rounded-xl border shadow', className)}>
                {children}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};
