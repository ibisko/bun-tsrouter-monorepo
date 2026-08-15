import { useState } from 'react';
import type { Align, Side } from './type';

type UsePopoverParam = {
  triggerRect: DOMRect;
  side?: Side;
  align?: Align;
  offset: number;
  initTop?: number;
  initLeft?: number;
};
export const usePopoverContent = ({ triggerRect, side, align, offset, initTop = triggerRect.top, initLeft = triggerRect.left }: UsePopoverParam) => {
  const [top, setTop] = useState(initTop);
  const [left, setLeft] = useState(initLeft);

  const [halfTranslateX, setHalfTranslateX] = useState(false);
  const [halfTranslateY, setHalfTranslateY] = useState(false);
  const [translateX, setTranslateX] = useState(false);
  const [translateY, setTranslateY] = useState(false);

  const setPosition = () => {
    const { top, left, useHalfTranslateX, useHalfTranslateY, useTranslateX, useTranslateY } = getPosition({ triggerRect, side, align, offset });
    setHalfTranslateX(useHalfTranslateX);
    setHalfTranslateY(useHalfTranslateY);
    setTranslateX(useTranslateX);
    setTranslateY(useTranslateY);
    setTop(top);
    setLeft(left);
  };

  return {
    top,
    left,
    halfTranslateX,
    halfTranslateY,
    translateX,
    translateY,
    setPosition,
  };
};

type Pppposition = {
  triggerRect: DOMRect;
  side?: Side;
  align?: Align;
  offset?: number;
};

export const getPosition = ({ triggerRect, side, align, offset = 6 }: Pppposition) => {
  let top = triggerRect.top;
  let left = triggerRect.left;
  let useTranslateX = false;
  let useTranslateY = false;
  let useHalfTranslateX = false;
  let useHalfTranslateY = false;

  if (side === 'left' || side === 'right') {
    if (side === 'left') {
      left = triggerRect.left - offset;
      useTranslateX = true;
    } else if (side === 'right') {
      left = triggerRect.right + offset;
    }

    switch (align) {
      case 'center':
        top = triggerRect.top + ~~(triggerRect.height / 2);
        useHalfTranslateY = true;
        break;
      case 'end':
        top = triggerRect.bottom;
        useTranslateY = true;
        break;
    }
  }

  if (side === 'top' || side === 'bottom') {
    if (side === 'bottom') {
      top = triggerRect.bottom + offset;
    } else if (side === 'top') {
      top = triggerRect.top - offset;
      useTranslateY = true;
    }

    switch (align) {
      case 'center':
        left = triggerRect.left + ~~(triggerRect.width / 2);
        useHalfTranslateX = true;
        break;
      case 'end':
        left = triggerRect.right;
        useTranslateX = true;
        break;
    }
  }

  top = top + window.scrollY;
  left = left + window.scrollX;

  return { top, left, useTranslateX, useTranslateY, useHalfTranslateX, useHalfTranslateY };
};
