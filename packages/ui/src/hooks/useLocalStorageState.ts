import { useState } from 'react';

export const useLocalStorageState = <T extends string | number | object>(
  defaultValue: T,
  storageKeyName: string,
): [T, (e: T | ((param: T) => T)) => void] => {
  const [val, setVal] = useState(() => {
    const storageVal = localStorage.getItem(storageKeyName);
    if (storageVal) {
      return JSON.parse(storageVal);
    }
    return defaultValue;
  });

  const setValBefore = (e: T | ((param: T) => T)) => {
    if (typeof e === 'function') {
      localStorage.setItem(storageKeyName, JSON.stringify(e(val)));
    } else {
      localStorage.setItem(storageKeyName, JSON.stringify(e));
    }
    setVal(e);
  };

  return [val, setValBefore];
};
