export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// 深度 Partial
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type Undefinedable<T> = {
  [K in keyof T]?: T[K];
};

export type MaybePromise<T> = Promise<T> | T;
export type Func = (...args: any) => any;
export type AwaitedReturn<T extends Func> = Awaited<ReturnType<T>>;

/** 判断是否为 普通对象, 排除数组/函数/基本数据类型 */
export type IsPlainObject<T> = T extends object ? (T extends readonly any[] ? false : true) : false;
