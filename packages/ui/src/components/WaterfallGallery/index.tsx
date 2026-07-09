import { useResizeObserver } from '@/hooks/useResizeObserver';
import { cn, useDebounce } from '@packages/ui';
import { cloneDeep } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

type WaterfallGalleryProps<T> = {
  className?: string;
  data: T[];
  render: (param: T, updateNodeHeight: (height: number) => void) => React.ReactNode;

  keyCode: keyof T;
  cols: {
    sm?: number; // 640
    md?: number; // 768
    lg?: number; // 1024
    xl?: number; // 1280
    '2xl'?: number; // 1536
  };
};
export const WaterfallGallery = <T = any,>({ className, keyCode, data, render, cols }: WaterfallGalleryProps<T>) => {
  const wrapperDomRef = useRef<HTMLDivElement>(null);
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
    const presetSize = matchWidthToPresetSize();
    const count = presetSize ? cols[presetSize] || 1 : 1;
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

  return (
    <div className={cn('relative flex flex-wrap', className)} ref={wrapperDomRef}>
      {data.map((item, index) => {
        return (
          <BoxItem pos={positions[index]} indexKey={index} key={item[keyCode] as string}>
            {render(item, height => updateNodeHeight(index, height))}
          </BoxItem>
        );
      })}
    </div>
  );
};

type BoxItemProps = {
  className?: string;
  pos: WaterfallGalleryPosition;
  indexKey: number;
  children: React.ReactNode;
};
const BoxItem = ({ className, pos, indexKey, children }: BoxItemProps) => {
  const boxRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn('absolute transition-all duration', className)}
      ref={boxRef}
      style={{
        top: posFieldValue({ pos, field: 'top', defaultValue: 'auto' }),
        left: posFieldValue({ pos, field: 'left', defaultValue: 'auto' }),
        width: posFieldValue({ pos, field: 'width', defaultValue: 'auto' }),
        height: posFieldValue({ pos, field: 'height', defaultValue: 'auto' }),
        opacity: pos?.opacity ? `${pos.opacity}` : '0',
      }}
      key={indexKey as number}>
      {children}
    </div>
  );
};

const pxToNum = (data: string, defaultValue: number) => {
  const match = /^(\d+)px$/.exec(data);
  if (!match) return defaultValue;
  return +match[1];
};

const matchWidthToPresetSize = () => {
  const len = document.body.offsetWidth;
  if (len >= 1536) return '2xl';
  if (len >= 1280) return 'xl';
  if (len >= 1024) return 'lg';
  if (len >= 768) return 'md';
  if (len >= 640) return 'sm';
};

type PosFieldValueParam = { pos?: WaterfallGalleryPosition; field: keyof WaterfallGalleryPosition; defaultValue: string };
const posFieldValue = ({ pos, field, defaultValue }: PosFieldValueParam) => {
  if (pos?.[field]) {
    return `${pos[field]}px`;
  }
  return defaultValue;
};

type WaterfallGalleryPosition = {
  index: number;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  opacity?: number;
};
