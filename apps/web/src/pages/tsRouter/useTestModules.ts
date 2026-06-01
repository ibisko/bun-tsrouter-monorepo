import { ResponseError } from '@packages/tsrouter/client';
import { useRef, useState } from 'react';

export const useTestModules = () => {
  const idRef = useRef(0);
  const [modules, setModules] = useState<TestModuleItem[]>([]);

  const setModule = async (method: string, title: string, callback: () => Promise<void>) => {
    const id = idRef.current;
    idRef.current++;

    setModules(e => [...e, { id, method, title, status: 'loading' }]);

    try {
      await callback();
      setModules(e =>
        e.map(item => {
          if (item.id === id) {
            const obj = Object.assign(item) as TestModuleItem;
            obj.status = 'success';
            return obj;
          }
          return item;
        }),
      );
    } catch (error) {
      if (error instanceof ResponseError || error instanceof Error) {
        setModules(e =>
          e.map(item => {
            if (item.id === id) {
              const obj = Object.assign(item) as TestModuleItem;
              obj.status = 'failed';
              obj.reason = error.message;
              return obj;
            }
            return item;
          }),
        );
      }
    }
  };

  return {
    modules,
    setModule,
  };
};

export type TestModuleItem = {
  id: number;
  method: string;
  title: string;
  status: 'loading' | 'success' | 'failed';
  reason?: string;
};
