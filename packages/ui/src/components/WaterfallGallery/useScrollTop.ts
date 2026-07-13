import { useThrottle } from '@/main';
import { useState } from 'react';

export const useScrollTop = () => {
  const [scrollTop, setScrollTop] = useState(0);

  const setScrollTopThrottle = useThrottle((top: number) => {
    setScrollTop(top);
  }, 60);

  return {
    scrollTop,
    setScrollTop: setScrollTopThrottle,
  };
};
