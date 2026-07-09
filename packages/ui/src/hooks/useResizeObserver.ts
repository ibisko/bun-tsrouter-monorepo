import { useEffect } from 'react';

export const useResizeObserver = (
  dom: React.RefObject<HTMLElement | null>,
  callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void,
) => {
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries, observer) => {
      callback(entries, observer);
    });
    if (dom.current) resizeObserver.observe(dom.current);
    return () => {
      if (dom.current) resizeObserver.unobserve(dom.current);
    };
  }, []);
};
