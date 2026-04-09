import { useEffect, useRef, useState } from 'react';

type UseAnimatedMountOptions = {
  open: boolean;
  duration?: number;
};

/**
 * 管理 open/mounted/visible 生命周期：
 * open → mount → rAF → rAF → visible（播打开动画）
 * close → visible=false → duration ms 后 unmount（播完关闭动画再卸载 DOM）
 */
export function useAnimatedMount({ open, duration = 150 }: UseAnimatedMountOptions) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closingRef = useRef(false);

  useEffect(() => {
    if (open) {
      closingRef.current = false;
      clearTimeout(closeTimerRef.current);
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else if (visible) {
      closingRef.current = true;
      setVisible(false);
      closeTimerRef.current = setTimeout(() => {
        closingRef.current = false;
        setMounted(false);
      }, duration);
    } else if (!closingRef.current) {
      setMounted(false);
    }

    return () => clearTimeout(closeTimerRef.current);
  }, [open, visible, duration]);

  return { visible, mounted };
}
