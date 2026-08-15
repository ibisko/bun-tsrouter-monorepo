import { useEffect, useRef, useState } from 'react';
import { useDebounce, useResizeObserver } from '@/main';
import { cloneDeep } from 'lodash-es';

export const usePositions = (data: any[], wrapperDomRef: React.RefObject<HTMLDivElement | null>) => {
  const [contentHeight, setContentHeight] = useState(0);
  const wrapperHeightRef = useRef(0);
  const [positions, setPositions] = useState<Record<number, WaterfallGalleryPosition>>({});

  useEffect(() => {
    setPositions(val => {
      const res = cloneDeep(val);
      for (let i = 0; i < data.length; i++) {
        if (!res[i]) {
          res[i] = { index: i };
        }
      }
      return res;
    });
    updatePosition();
  }, [data]);

  const updateNodeHeight = (index: number, height: number) => {
    if (!wrapperDomRef.current) return;

    setPositions(val => {
      const res = cloneDeep(val);
      if (res[index]) {
        res[index].height = height;
      } else {
        res[index] = { index, height };
      }
      return res;
    });
    updatePosition();
  };

  const updatePosition = useDebounce(() => {
    if (!wrapperDomRef.current) return;

    const wrapperStyle = getComputedStyle(wrapperDomRef.current);
    const rowGap = pxToNum(wrapperStyle.rowGap, 0);
    const colGap = pxToNum(wrapperStyle.columnGap, 0);
    const wrapperWidth = wrapperDomRef.current.getBoundingClientRect().width;
    const matchRepeat = /^repeat\((\d+),/.exec(wrapperStyle.gridTemplateColumns);
    const count = matchRepeat ? +matchRepeat[1] : 1;
    const boxWidth = ~~((wrapperWidth - (count - 1) * rowGap) / count);

    setPositions(val => {
      const res = cloneDeep(val);
      const values = Object.values(res).sort((a, b) => a.index - b.index);
      const cacheTop: number[] = Array(count).fill(0);
      for (let index = 0; index < values.length; index++) {
        const minTop = Math.min(...cacheTop);
        const colIndex = cacheTop.findIndex(item => item === minTop);
        const item = values[index];
        if (item.height) {
          item.top = cacheTop[colIndex];
          cacheTop[colIndex] += item.height + colGap;
          wrapperHeightRef.current = Math.max(...cacheTop) - colGap;
        }
        item.left = colIndex * (boxWidth + rowGap);
        item.width = boxWidth;
        item.opacity = 100;
      }
      return res;
    });
  }, 100);

  useResizeObserver(wrapperDomRef, () => {
    if (wrapperDomRef.current) {
      updatePosition();
    }
  });

  useEffect(() => {
    setContentHeight(wrapperHeightRef.current);
  }, [positions]);

  return {
    positions,
    contentHeight,
    wrapperDomRef,
    updateNodeHeight,
  };
};

const pxToNum = (data: string, defaultValue: number) => {
  const match = /^(\d+)px$/.exec(data);
  if (!match) return defaultValue;
  return +match[1];
};

type WaterfallGalleryPosition = {
  index: number;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  opacity?: number;
};
