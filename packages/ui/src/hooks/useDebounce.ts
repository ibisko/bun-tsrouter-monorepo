import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash-es/debounce';
import { type DebounceSettings } from 'lodash-es/debounce';

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  options: DebounceSettings = {},
): ((...args: Parameters<T>) => void) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedCallback = useCallback(
    debounce((...args: Parameters<T>) => callbackRef.current(...args), delay, options),
    [delay],
  );

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
