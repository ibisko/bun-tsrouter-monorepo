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
