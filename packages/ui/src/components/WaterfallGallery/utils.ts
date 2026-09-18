export const numToPx = (val?: number, defaultValue?: string) => {
  if (val || val === 0) {
    return `${val}px`;
  }
  return defaultValue;
};

export const pxToNum = (data: string, defaultValue: number) => {
  const num = parseFloat(data);
  return Number.isNaN(num) ? defaultValue : num;
};

export type WaterfallGalleryPosition = {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  opacity?: number;
};
