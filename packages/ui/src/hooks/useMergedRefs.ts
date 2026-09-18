import { useCallback } from 'react';

/**
 * 合并多个 ref 到一个回调 ref 上,React 挂载时把 node 分发给所有 ref。
 * 参考 radix-ui compose-refs 的实现。
 */
const mergeRefs =
  <T = HTMLElement>(...refs: Array<React.Ref<T> | undefined>) =>
  (node: T | null) => {
    let hasCleanup = false;
    const cleanups = refs.map(ref => {
      if (!ref) return;
      if (typeof ref === 'function') {
        const cleanup = ref(node);
        if (typeof cleanup === 'function') hasCleanup = true;
        return cleanup;
      }
      ref.current = node;
    });
    // 关键:只有存在 cleanup 型 ref 才走 cleanup 路线;
    // 全都没有则返回 undefined,React 退回旧式 ref(null),兼容 `if (node) ... else ...` 老写法
    if (!hasCleanup) return;
    return () => {
      refs.forEach((ref, i) => {
        const cleanup = cleanups[i];
        if (typeof cleanup === 'function') {
          cleanup();
        } else if (ref) {
          // React 只认识外层这一个回调,看不见里面的 ref,置空/通知 null 要自己做
          if (typeof ref === 'function') ref(null);
          else ref.current = null;
        }
      });
    };
  };

/** 包装成 hook,稳定回调引用,避免每次渲染 detach/reattach */
export const useMergedRefs = <T = HTMLElement>(...refs: Array<React.Ref<T> | undefined>) => useCallback(mergeRefs(...refs), refs);
