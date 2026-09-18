import { useEffect, useRef } from 'react';
import type { MaybePromise } from 'bun';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

type UseReachBottomParam<T> = {
  total?: number;
  data: T[];
  onReachBottom?: () => MaybePromise<void>;
};

const SETTLE_MS = 500; // 哨兵静止多久算渲染落定
const CAP_MS = 2000; // 观察封顶,防内容常年抖动饿死补页

export const useReachBottom = <T = any>({ data, total, onReachBottom }: UseReachBottomParam<T>) => {
  const totalRef = useRef(0);
  const dataLengthRef = useRef(0);
  const visibleRef = useRef(false);
  const loadingRef = useRef(false);
  const failedRef = useRef(false);

  // total=0 是"未知",继续尝试
  const canLoadMore = () => totalRef.current === 0 || totalRef.current !== dataLengthRef.current;

  // 渲染落定:绝对定位的项不占流,哨兵静止满 SETTLE_MS 才算稳(图标/图片挂载后才陆续长高)
  const evaluateAfterSettle = () => {
    const start = performance.now();
    let quietStart = start;
    let lastTop = NaN;
    const tick = (now: number) => {
      if (loadingRef.current) return; // 在途,新一轮的 finally 会重新观察
      const dom = reachBottomRef.current;
      if (!dom) return; // 哨兵卸载 = 到底
      const top = dom.getBoundingClientRect().top;
      if (top > window.innerHeight) return; // 已填满
      if (top !== lastTop) {
        lastTop = top;
        quietStart = now;
      }
      if (now - quietStart >= SETTLE_MS || now - start >= CAP_MS) return tryLoad();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const tryLoad = () => {
    if (loadingRef.current || failedRef.current || !visibleRef.current || !canLoadMore() || !onReachBottom) return;
    if (!reachBottomRef.current) return; // 哨兵已卸载,visibleRef 可能还是 true
    loadingRef.current = true;
    Promise.resolve(onReachBottom())
      .catch(() => {
        failedRef.current = true; // 失败等重新进入视口再试
      })
      .finally(() => {
        loadingRef.current = false;
        if (!failedRef.current) evaluateAfterSettle();
      });
  };

  useEffect(() => {
    if (total !== undefined) totalRef.current = total;
    dataLengthRef.current = data.length;
  }, [total, data]);

  const { ref: reachBottomRef } = useIntersectionObserver({
    callback: visible => {
      visibleRef.current = visible;
      if (visible) failedRef.current = false; // 重新进入视口,给失败重试机会
      tryLoad(); // 刚进入视口几何是新鲜的,不等落定
    },
    once: false,
  });

  return { reachBottomRef };
};
