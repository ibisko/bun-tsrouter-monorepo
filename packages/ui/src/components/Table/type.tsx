export type Columns<T extends Record<string, any>> = {
  tilte?: string;
  /** 保留补全的字符串类型，很神奇！ */
  dataIndex: keyof T | (string & {});
  width?: number;
  fixed?: 'left' | 'right';
  stickyOffset?: number;
  render?: (data: T) => React.ReactNode;
};
