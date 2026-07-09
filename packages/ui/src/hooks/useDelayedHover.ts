import { useEffect, useRef, useState } from 'react';

export const useDelayedHover = (closeDelay: number) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const onMouseLeave = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  const onMouseMove = () => {
    setOpen(true);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  return {
    open,
    setOpen,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  };
};
