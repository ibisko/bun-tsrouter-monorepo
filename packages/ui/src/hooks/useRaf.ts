import { useCallback, useEffect, useRef } from 'react';

/**
 * 用 rAF 调度固定回调：同一帧内多次调用 schedule，只会在下一次屏幕刷新时
 * 执行一次 fn 的最新闭包 —— 跟渲染同步、不抖动、不丢最后一帧。
 *
 * @example
 * const setContentHandle = useRaf(() => setContent(compute(scrollTop)));
 * useEffect(() => setContentHandle(), [scrollTop]);
 */
export const useRaf = (fn: () => void) => {
  const frameRef = useRef<number | null>(null);
  const callbackRef = useRef(fn);
  callbackRef.current = fn; // 每次渲染同步最新闭包

  const schedule = useCallback(() => {
    // 同帧已有调度就跳过，避免重复排队
    if (frameRef.current != null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      callbackRef.current();
    });
  }, []);

  // 卸载时清理，避免 rAF 泄漏；重置 frameRef 以兼容 StrictMode 重挂载
  useEffect(() => {
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, []);

  return schedule;
};
