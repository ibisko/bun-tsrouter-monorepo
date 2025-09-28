/** 返回的是对象、函数的代理，当访问对象的时候就会触发 */
const createFlatProxy = (obj: object, callback: (path: string) => any): any =>
  new Proxy(obj, {
    get(_obj, name) {
      if (typeof name !== 'string' || name === 'then') {
        return undefined;
      }
      return callback(name as any);
    },
  });

export const createRecursiveProxy = <T = any, R = string[]>(
  handles: RecursiveProxyHandles<R> | Handle<R>,
  transform?: Transform<R>,
): T => {
  const build = (path: string[] = [], obj = {}) =>
    createFlatProxy(obj, action => {
      const nextPrefix = path.concat(action);
      const currentPath = transform?.(path) ?? (path as R);
      if (typeof handles === 'function') {
        return build(nextPrefix, (...args: any[]) => handles(currentPath, ...args));
      } else {
        const callback = handles[action];
        if (!callback) {
          return build(nextPrefix, () => {
            throw new Error(`method "${action}" is undefined for "${path}"`);
          });
        }
        return build(nextPrefix, (...args: any[]) => callback(currentPath, ...args));
      }
    });
  return build();
};

type RecursiveProxyHandles<T> = Record<string, Handle<T>>;
type Handle<T> = (path: T, ...args: any[]) => void;
type Transform<T> = (paths: string[]) => T;
