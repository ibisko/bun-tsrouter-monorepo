import { useEffect } from 'react';

export const useInitial = (callback: Function, deps: React.DependencyList = []) => {
  useEffect(() => {
    callback();
  }, deps);
};
