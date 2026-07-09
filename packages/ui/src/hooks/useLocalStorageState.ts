import { useEffect, useState } from 'react';

export const useLocalStorageState = <T = any>(defaultValue: T, storageKeyName: string): [T, (e: T) => void] => {
  const [val, setVal] = useState(defaultValue);

  useEffect(() => {
    const storageVal = localStorage.getItem(storageKeyName);
    if (storageVal) {
      setVal(JSON.parse(storageVal));
    }
  }, []);

  const setValBefore = (e: T) => {
    localStorage.setItem(storageKeyName, JSON.stringify(e));
    setVal(e);
  };

  return [val, setValBefore];
};
