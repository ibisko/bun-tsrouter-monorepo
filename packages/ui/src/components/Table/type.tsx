export type Columns<T extends Record<string, any>> = {
  tilte?: string;
  dataIndex: keyof T;
  width?: number;
  fixed?: 'left' | 'right';
  stickyOffset?: number;
  render?: (data: T) => React.ReactNode;
};
