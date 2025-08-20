import type { AppRouter, Action } from '@apps/server';

type ApiResponseErrorParam = { status: number; data: any };
export class ApiResponseError extends Error {
  response: ApiResponseErrorParam;
  constructor(response: ApiResponseErrorParam, message?: string | undefined, options?: ErrorOptions | undefined) {
    super(message, options);
    this.response = response;
  }
}

type FetchInstanceOptions = {
  baseUrl: string;
  headers?: { [k: string]: string };
  // timeout: number
};

type ActionOptions = {
  headers?: { [k: string]: string };
};
interface PostOptions extends ActionOptions {
  query?: { [k: string]: string };
}

class FetchInstance {
  baseUrl: string;
  headers: { [k: string]: string };
  constructor(options: FetchInstanceOptions) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers || {};
  }

  async fetchResponseHandle(response: Response) {
    // todo 重试次数
    let res;
    try {
      res = await response.json();
    } catch (error) {
      res = await response.text();
    }
    if (response.status >= 400) {
      // todo 401 jwt 刷新
      if (response.status === 404) {
        res = res.message;
      }
      throw new ApiResponseError({
        status: response.status,
        data: res,
      });
    }
    return res;
  }

  mergeHeaders(headers: { [k: string]: string } = {}) {
    return Object.assign(
      {
        'Content-Type': 'application/json',
      },
      this.headers,
      headers,
    );
  }

  get(path: string) {
    return async (query: { [k: string]: string }, options?: ActionOptions) => {
      const url = new URL(`/api${path}`, this.baseUrl);
      Object.entries(query).map(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
      const response = await fetch(url, {
        method: 'get',
        headers: this.mergeHeaders(options?.headers),
      });
      return this.fetchResponseHandle(response);
    };
  }

  post(path: string) {
    return async (body: any, options?: PostOptions) => {
      const url = new URL(`/api${path}`, this.baseUrl);
      if (options?.query) {
        Object.entries(options.query).map(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }
      const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: this.mergeHeaders(options?.headers),
      });
      return this.fetchResponseHandle(response);
    };
  }
}

const fetchInstance = new FetchInstance({ baseUrl: 'http://localhost:5773' });

const createFlatProxy = (obj: object, callback: (path: string) => any) =>
  new Proxy(obj, {
    get(_obj, name) {
      if (typeof name !== 'string' || name === 'then') {
        return undefined;
      }
      return callback(name as any);
    },
  });
const createRecursiveProxy = (prefix = '', obj = {}) =>
  createFlatProxy(obj, action => {
    const nextPrefix = `${prefix}/${action}`;
    switch (action) {
      case 'get':
        return createRecursiveProxy(nextPrefix, fetchInstance.get(prefix));
      case 'post':
        return createRecursiveProxy(nextPrefix, fetchInstance.post(prefix));
      default:
        return createRecursiveProxy(nextPrefix, () => {
          throw new Error(`API method "${action}" is undefined for "${prefix}"`);
        });
    }
  });
export const Api = createRecursiveProxy() as ReplaceSpecificLeaf<AppRouter>;

// 实际ts类型提示
type GetAction<T extends Action<any, 'get'>> = {
  get: (param: T['param'], options?: ActionOptions) => T['returnType'];
};
type PostAction<T extends Action<any, 'post'>> = {
  post: (param: T['param'], options?: PostOptions) => T['returnType'];
};
// 判断是否为 普通对象, 排除数组/函数/基本数据类型
type IsPlainObject<T> = T extends object ? (T extends readonly any[] ? false : true) : false;
type ReplaceSpecificLeaf<T> = T extends Action<any, 'get'>
  ? GetAction<T>
  : T extends Action<any, 'post'>
  ? PostAction<T>
  : IsPlainObject<T> extends true
  ? { [K in keyof T]: ReplaceSpecificLeaf<T[K]> }
  : T;

// 参考 Alova.js https://alova.js.org/zh-CN/tutorial/getting-started/introduce
// todo jwt 续签
// todo form 表单
// todo table 分页
// todo 验证码封装 useCaptcha

// todo 请求方式，第二参数可选作为扩展参数
// - 如 post 可以添加 query，对应服务端该怎么做呢？
// - 重试次数

// todo 提供并发请求函数
// todo action 类型，从server里定义吧
