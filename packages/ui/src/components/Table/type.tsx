export type Columns = {
  tilte: string;
  dataIndex: string;
  width?: number;
  fixed?: 'left' | 'right';
  stickyOffset?: number;
  render?: (data: any) => React.ReactNode;
};
