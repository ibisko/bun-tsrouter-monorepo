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
