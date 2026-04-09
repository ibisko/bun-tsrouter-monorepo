import { createPortal } from 'react-dom';
import { cn } from '@/main';
import { useAnimatedMount } from '@/utils/useAnimatedMount';

type DialogProps = {
  className?: string;
  children: React.ReactNode;
  open: boolean;
  cancel: () => void;
};

export const Dialog = ({ className, children, open, cancel }: DialogProps) => {
  const { visible, mounted } = useAnimatedMount({ open, duration: 300 });

  return (
    <>
      {mounted &&
        createPortal(
          <div
            className={cn(
              'fixed top-0 left-0 w-screen h-screen bg-background/50 transition duration-300',
              visible ? 'opacity-100' : 'opacity-0',
            )}
          >
            <div className="absolute inset-0" onClick={cancel} />
            <div className={cn('fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-4 rounded-xl border shadow', className)}>
              {children}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
