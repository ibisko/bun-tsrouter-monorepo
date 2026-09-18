import { useCallback, useEffect, useRef } from 'react';

const layers = new Set<HTMLElement>();

export function useLayer<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const dom = ref.current;
    if (!dom) return;
    layers.add(dom);
    return () => {
      layers.delete(dom);
    };
  }, []);

  const isTargetInUpperLayer = useCallback((target: Node) => {
    const dom = ref.current;
    if (!dom) return false;
    let reachedCurrent = false;
    for (const node of layers) {
      if (node === dom) {
        reachedCurrent = true;
      } else if (reachedCurrent && node.contains(target)) {
        return true;
      }
    }
    return false;
  }, []);

  return { ref, isTargetInUpperLayer };
}
