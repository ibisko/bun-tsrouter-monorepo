export const pxToNum = (data: string, defaultValue: number) => {
  const match = /^(\d+)px$/.exec(data);
  if (!match) return defaultValue;
  return +match[1];
};

export type PosFieldValueParam = { pos?: WaterfallGalleryPosition; field: keyof WaterfallGalleryPosition; defaultValue: string };

export const posFieldValue = ({ pos, field, defaultValue }: PosFieldValueParam) => {
  if (pos?.[field]) {
    return `${pos[field]}px`;
  }
  return defaultValue;
};

export type WaterfallGalleryPosition = {
  index: number;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  opacity?: number;
};
