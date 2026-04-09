export type Placement = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

export const calcPosition = (
  triggerRect: DOMRect,
  contentRect: DOMRect,
  side: Placement,
  sideOffset: number,
  align: Align,
): { top: number; left: number } => {
  let top: number;
  let left: number;

  switch (side) {
    case 'bottom':
      top = triggerRect.bottom + sideOffset;
      left = triggerRect.left;
      break;
    case 'top':
      top = triggerRect.top - contentRect.height - sideOffset;
      left = triggerRect.left;
      break;
    case 'left':
      top = triggerRect.top;
      left = triggerRect.left - contentRect.width - sideOffset;
      break;
    case 'right':
      top = triggerRect.top;
      left = triggerRect.right + sideOffset;
      break;
  }

  switch (align) {
    case 'start':
      if (side === 'left' || side === 'right') top = triggerRect.top;
      else left = triggerRect.left;
      break;
    case 'end':
      if (side === 'left' || side === 'right') top = triggerRect.bottom - contentRect.height;
      else left = triggerRect.right - contentRect.width;
      break;
    case 'center':
      if (side === 'left' || side === 'right') top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
      else left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      break;
  }

  return {
    top: Math.max(4, Math.min(top, window.innerHeight - contentRect.height - 4)),
    left: Math.max(4, Math.min(left, window.innerWidth - contentRect.width - 4)),
  };
};
