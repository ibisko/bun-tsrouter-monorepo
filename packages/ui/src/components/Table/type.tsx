export type Columns = {
  tilte: string;
  dataIndex: string;
  width?: number;
  render?: (data: any) => React.ReactNode;
};
