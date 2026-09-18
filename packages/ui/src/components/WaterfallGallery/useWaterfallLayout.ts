import { useEffect, useRef, useState } from 'react';
import { useRaf, useResizeObserver } from '@/main';
import { pxToNum, type WaterfallGalleryPosition } from './utils';
import { createPositionStore, type PositionStore } from './positionStore';

type Content<T> = {
  pos: PositionStore;
  key: React.Key;
  item: T;
  index: number;
};

export const useWaterfallLayout = <T>(data: T[], keyField: string, pageScroll?: boolean) => {
  const wrapperDomRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [content, setContent] = useState<Content<T>[]>([]);
  const positionsRef = useRef<Record<number, PositionStore>>({});
  const lastRunRef = useRef({ scrollTop: NaN, viewportBottom: NaN, dirty: false });

  const setContentHandle = useRaf(() => {
    if (!wrapperDomRef.current) return;

    const wrapperTop = wrapperDomRef.current.getBoundingClientRect().top;
    const scrollTop = pageScroll ? -wrapperTop : wrapperDomRef.current.scrollTop;
    const viewportBottom = scrollTop + (pageScroll ? window.innerHeight : wrapperDomRef.current.clientHeight);
    const last = lastRunRef.current;

    if (!last.dirty && scrollTop === last.scrollTop && viewportBottom === last.viewportBottom) return;

    lastRunRef.current = { scrollTop, viewportBottom, dirty: false };
    const _content: Content<T>[] = [];
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      const pos = positionsRef.current[index];
      if (!pos) continue;
      const info = pos.getSnapshot();
      if (info.top! + info.height! < scrollTop) continue;
      if (info.top! > viewportBottom) continue;

      _content.push({ item, index, pos, key: item[keyField as keyof T] as React.Key });
    }

    setContent(prev => {
      if (prev.length !== _content.length) return _content;
      for (let i = 0; i < _content.length; i++) {
        if (prev[i].item !== _content[i].item || prev[i].pos !== _content[i].pos) return _content;
      }
      return prev;
    });
  });

  const updatePosition = useRaf(() => {
    if (!wrapperDomRef.current) return;

    const wrapperStyle = getComputedStyle(wrapperDomRef.current);
    const paddingTop = pxToNum(wrapperStyle.paddingTop, 0);
    const paddingLeft = pxToNum(wrapperStyle.paddingLeft, 0);
    const paddingRight = pxToNum(wrapperStyle.paddingRight, 0);
    const rowGap = pxToNum(wrapperStyle.rowGap, 0);
    const colGap = pxToNum(wrapperStyle.columnGap, 0);

    const wrapperWidth = wrapperDomRef.current.clientWidth - (paddingLeft + paddingRight);
    const matchRepeat = /^repeat\((\d+),/.exec(wrapperStyle.gridTemplateColumns);
    const count = matchRepeat ? +matchRepeat[1] : 1;
    const boxWidth = ~~(((wrapperWidth - (count - 1) * colGap) / count) * 1e3) / 1e3;

    // 整数 key 的对象天然按索引升序迭代,不用再排序
    const values = Object.values(positionsRef.current);
    const cacheTop: number[] = Array(count).fill(paddingTop);
    let hasMeasured = false;
    for (let index = 0; index < values.length; index++) {
      const store = values[index];
      const item = store.getSnapshot();
      const next: WaterfallGalleryPosition = { ...item };

      // 找最矮的列放进去,并列取最左边(与原 Math.min + findIndex 行为一致)
      let colIndex = 0;
      for (let c = 1; c < count; c++) {
        if (cacheTop[c] < cacheTop[colIndex]) {
          colIndex = c;
        }
      }
      if (next.height) {
        next.top = cacheTop[colIndex];
        cacheTop[colIndex] += next.height + rowGap;
        hasMeasured = true;
      }
      next.left = paddingLeft + colIndex * (boxWidth + colGap);
      next.width = boxWidth;
      next.opacity = 1;
      if (store.commit(next)) {
        lastRunRef.current.dirty = true;
      }
    }

    // 内容高度只由最终列顶决定,循环外算一次;一项都没量过时保持原值
    if (hasMeasured) {
      setContentHeight(Math.max(...cacheTop) - rowGap - paddingTop);
    }

    setContentHandle();
  });

  const updateNodeHeight = (index: number, height: number) => {
    if (!wrapperDomRef.current) return;

    if (positionsRef.current[index]) {
      const target = positionsRef.current[index].getSnapshot();
      if (target.height === height) return;
      if (positionsRef.current[index].commit({ ...target, height })) {
        lastRunRef.current.dirty = true;
      }
    } else {
      positionsRef.current[index] = createPositionStore(height);
    }
    updatePosition();
  };

  useResizeObserver(wrapperDomRef, () => {
    if (wrapperDomRef.current) updatePosition();
  });

  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      if (!positionsRef.current[i]) {
        positionsRef.current[i] = createPositionStore();
      }
    }
    lastRunRef.current.dirty = true; // data 换了人,条目对象可能不同,可视扫描必须重跑
    updatePosition();
  }, [data]);

  // 页面滚动模式:scroll 事件不冒泡,div 上的 onScroll 收不到,得挂 window
  useEffect(() => {
    if (!pageScroll) return;
    window.addEventListener('scroll', setContentHandle, { passive: true });
    return () => window.removeEventListener('scroll', setContentHandle);
  }, [pageScroll]);

  return {
    wrapperDomRef,
    content,
    contentHeight,
    updateNodeHeight,
    setContentHandle,
  };
};
