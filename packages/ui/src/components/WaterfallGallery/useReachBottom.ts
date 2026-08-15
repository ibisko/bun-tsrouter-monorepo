import { useIntersectionObserver, useResizeObserver } from '@/main';
import { useEffect, useRef, useState } from 'react';

type UseReachBottomParam = {
  total?: number;
  data: any;
  wrapperDomRef: React.RefObject<HTMLDivElement | null>;
  onReachBottom?: () => void;
};
export const useReachBottom = ({ data, total, wrapperDomRef, onReachBottom }: UseReachBottomParam) => {
  const totalRef = useRef(0);
  const dataLengthRef = useRef(0);
  const autoReachTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (total !== undefined) {
      totalRef.current = total;
    }
    dataLengthRef.current = data.length;

    if (autoReachTimeout.current) clearTimeout(autoReachTimeout.current);
    if (onReachBottom && totalRef.current !== dataLengthRef.current && reachBottomVisibleRef.current) {
      autoReachTimeout.current = setTimeout(() => {
        if (!reachBottomRef.current) return;
        if (reachBottomVisibleRef.current) {
          onReachBottom?.();
        }
      }, 1e3);
    }
  }, [total, data]);

  const reachBottomVisibleRef = useRef(false);

  const { ref: reachBottomRef } = useIntersectionObserver({
    callback: visible => {
      if (!onReachBottom) return;
      reachBottomVisibleRef.current = visible;
      if (autoReachTimeout.current) clearTimeout(autoReachTimeout.current);
      if (visible) {
        if (totalRef.current === 0) {
          onReachBottom();
        } else if (totalRef.current !== dataLengthRef.current) {
          onReachBottom();
        }
      }
    },
    once: false,
  });

  const [wrapperHeight, setWrapperHeight] = useState(0);

  useResizeObserver(wrapperDomRef, () => {
    if (wrapperDomRef.current) {
      setWrapperHeight(wrapperDomRef.current.getBoundingClientRect().height);
    }
  });

  return {
    reachBottomRef,
    wrapperHeight,
  };
};
