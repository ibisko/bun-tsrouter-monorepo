import { useCallback, useEffect, useRef } from 'react';

/**
 * 用 rAF 调度一个回调：高频调用返回的 schedule 时，同一帧内只会在
 * 下一次屏幕刷新时执行最后一次 —— 跟渲染同步、不抖动、不丢最后一帧。
 *
 * @example
 * const schedule = useRaf();
 * const onMouseMove = (e) => {
 *   const rect = e.currentTarget.getBoundingClientRect();
 *   schedule(() => {
 *     console.log(((e.clientX - rect.left) / rect.width) * 100);
 *   });
 * };
 */
export const useRaf = () => {
  const frameRef = useRef<number | null>(null);
  const callbackRef = useRef<(() => void) | null>(null);

  const schedule = useCallback((fn: () => void) => {
    // 同帧已有调度就只更新待执行的回调，避免重复排队
    callbackRef.current = fn;
    if (frameRef.current != null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      callbackRef.current?.();
    });
  }, []);

  // 卸载时清理，避免 rAF 泄漏
  useEffect(() => {
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return schedule;
};
