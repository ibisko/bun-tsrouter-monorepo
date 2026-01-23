import { throttle } from 'lodash-es';

export function Throttle(delay: number, options?: any) {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = throttle(originalMethod, delay, options);
    return descriptor;
  };
}

export function WaitQueue(_: any, __: any, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const pendingPromiseMap = new WeakMap<object, Promise<unknown>>();

  descriptor.value = async function (...params: any[]) {
    const pendingPromise = pendingPromiseMap.get(this);
    let currentPromise: Promise<any>;
    const execute = async () => {
      try {
        return await originalMethod.apply(this, params);
      } finally {
        if (pendingPromiseMap.get(this) === currentPromise) {
          pendingPromiseMap.delete(this);
        }
      }
    };

    if (pendingPromise) {
      currentPromise = pendingPromise.then(execute, execute);
      pendingPromiseMap.set(this, currentPromise);
      return currentPromise;
    } else {
      currentPromise = execute();
      pendingPromiseMap.set(this, currentPromise);
      return currentPromise;
    }
  };

  return descriptor;
}
