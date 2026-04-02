import { Card, Table } from '@packages/ui';

export const TableComps = () => {
  return (
    <Card>
      <div>{'<Table/>'}</div>
      <Table<TableItemInfo & { optional?: any }>
        columns={[
          { tilte: 'Name', dataIndex: 'name' },
          { tilte: 'Age', dataIndex: 'age' },
          {
            tilte: 'Operation',
            dataIndex: 'optional',
            render: col => (
              <div className="flex gap-1 text-xs">
                <div className="border rounded px-1">{col.myId}</div>
                <div className="border rounded px-1">{col.name}</div>
                <div className="border rounded px-1 bg-primary">{col.age}</div>
              </div>
            ),
          },
        ]}
        primaryKey="myId"
        data={[
          { myId: 1, name: 'nnhu', age: 12 },
          { myId: 2, name: 'yyhaha', age: 32 },
          { myId: 3, name: 'ohya', age: 51 },
        ]}
      />
    </Card>
  );
};

type TableItemInfo = {
  myId: number;
  name: string;
  age: number;
};
