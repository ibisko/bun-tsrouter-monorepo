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

  useEffect(() => {
    if (total !== undefined) {
      totalRef.current = total;
    }
    dataLengthRef.current = data.length;
  }, [total, data]);

  const { ref: reachBottomRef } = useIntersectionObserver({
    callback: visible => {
      if (visible) {
        if (totalRef.current === 0) {
          onReachBottom?.();
        } else {
          if (totalRef.current === dataLengthRef.current) return;
          onReachBottom?.();
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
