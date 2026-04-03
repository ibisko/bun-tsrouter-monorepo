// 模块级单例，保证同一时间只有一个 tooltip
let activeHide: (() => void) | null = null;

export const dismissActive = () => {
  activeHide?.();
  activeHide = null;
};

export const register = (hide: () => void) => {
  dismissActive();
  activeHide = hide;
};

export const unregister = (hide: () => void) => {
  if (activeHide === hide) activeHide = null;
};
