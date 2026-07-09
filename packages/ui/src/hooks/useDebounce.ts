import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash-es/debounce';

/**
 * 自定义防抖 Hook
 * @param callback 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 */
export const useDebounce = <T extends (...args: any[]) => any>(callback: T, delay: number = 500) => {
  // 1. 用 ref 保存最新的函数引用，防止闭包过时
  const callbackRef = useRef(callback);

  // 每次 render 时同步最新的函数
  callbackRef.current = callback;

  // 2. 创建防抖函数
  // 注意：这里使用 useMemo 或 useCallback 确保函数引用稳定
  const debouncedCallback = useCallback(
    debounce((...args: Parameters<T>) => callbackRef.current(...args), delay),
    [delay], // 只有 delay 改变时才重新创建 debounce 实例
  );

  // 3. 组件卸载时自动清理，防止内存泄漏
  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
