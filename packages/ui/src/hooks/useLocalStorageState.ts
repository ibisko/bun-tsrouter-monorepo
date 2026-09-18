import { useEffect, useState } from 'react';

export const useLocalStorageState = <T extends string | number | boolean | null | undefined | object>(
  defaultValue: T,
  storageKeyName: string,
): [T, (e: T | ((param: T) => T)) => void] => {
  const [val, setVal] = useState(() => {
    const storageVal = localStorage.getItem(storageKeyName);
    if (storageVal) {
      if (storageVal === '<undefined>') {
        return undefined;
      } else {
        return JSON.parse(storageVal);
      }
    } else {
      if (defaultValue === undefined) {
        localStorage.setItem(storageKeyName, '<undefined>');
      } else {
        localStorage.setItem(storageKeyName, JSON.stringify(defaultValue));
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    if (val === undefined) {
      localStorage.setItem(storageKeyName, '<undefined>');
    } else {
      localStorage.setItem(storageKeyName, JSON.stringify(val));
    }
  }, [val]);

  return [val, setVal];
};
