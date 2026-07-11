import { useCallback, useEffect, useRef } from 'react';
import throttle from 'lodash-es/throttle';
import { type ThrottleSettings } from 'lodash-es/throttle';

/**
 * 节流
 * - options.leading 开头触发一次，默认 true
 * - options.trailing 结尾触发一次，默认 true
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  options?: ThrottleSettings,
): ((...args: Parameters<T>) => void) => {
  options ??= { leading: true, trailing: true };
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const throttledCallback = useCallback(
    throttle((...args: Parameters<T>) => callbackRef.current(...args), delay, options),
    [delay],
  );

  useEffect(() => {
    return () => {
      throttledCallback.cancel();
    };
  }, [throttledCallback]);

  return throttledCallback;
};
