export type TableResponse<T> = {
  skip: number;
  take: number;
  total: number;
  data: T[];
};
