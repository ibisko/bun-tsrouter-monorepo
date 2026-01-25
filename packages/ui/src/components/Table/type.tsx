export type Columns<T> = {
  tilte: string;
  dataIndex: keyof T;
  width?: number;
  fixed?: 'left' | 'right';
  stickyOffset?: number;
  render?: (data: T) => React.ReactNode;
};
