import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  /** 触发阈值，0~1，默认 0（刚进入可视区域即触发） */
  threshold?: number | number[];
  /** 相对于可视区域的根边距，如 "100px" */
  rootMargin?: string;
  /** 默认 true，触发一次后自动断开观察 */
  once?: boolean;
}

/**
 * 观察元素是否进入可视区域，返回 ref 和 isIntersecting 状态。
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>();
 * // 自定义选项
 * const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
 *   threshold: 0.5,
 *   rootMargin: '50px',
 *   once: false,
 * });
 * return <div ref={ref}>{isIntersecting ? '可见' : '不可见'}</div>;
 * ```
 */
export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
) => {
  const { threshold = 0, rootMargin, once = true } = options;

  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsIntersecting(visible);

        if (visible && once) observer.disconnect();
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isIntersecting };
};
