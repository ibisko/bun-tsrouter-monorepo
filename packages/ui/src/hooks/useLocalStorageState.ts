import { useEffect, useState } from 'react';

export const useLocalStorageState = <T = any>(defaultValue: T, storageKeyName: string): [T, (e: T) => void] => {
  const [val, setVal] = useState(() => {
    const storageVal = localStorage.getItem(storageKeyName);
    if (storageVal) {
      return JSON.parse(storageVal);
    }
    return defaultValue;
  });

  const setValBefore = (e: T) => {
    localStorage.setItem(storageKeyName, JSON.stringify(e));
    setVal(e);
  };

  return [val, setValBefore];
};
