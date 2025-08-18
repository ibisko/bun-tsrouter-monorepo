import type { AppRouter } from '@apps/server';

export const createFlatProxy = <T>(callback: (path: string & keyof T) => any): T => {
  return new Proxy(
    {},
    {
      get(_obj, name) {
        if (typeof name !== 'string' || name === 'then') {
          return undefined;
        }
        return callback(name as any);
      },
    },
  ) as T;
};

const get = async (path: string, query: { [k: string]: string | number | null | undefined }) => {
  const url = new URL(`/api${path}`, 'http://localhost:5773');
  Object.entries(query).map(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

const post = async (path: string, body: any) => {
  const url = new URL(`/api${path}`, 'http://localhost:5773').href;
  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

const createRecursiveProxy = (prefix = '') => {
  return createFlatProxy(key => {
    switch (key) {
      case 'get':
        return (param: any) => get(prefix, param);
      case 'post':
        return (param: any) => post(prefix, param);
      default:
        return createRecursiveProxy(prefix + '/' + key);
    }
  });
};

export const appRouter = createRecursiveProxy() as AppRouter;
