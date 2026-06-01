import { Table, type Columns } from '@packages/ui';
import { type TestModuleItem } from './useTestModules';
import { EosIconsBubbleLoading, IxCertificateSuccessFilled } from '@packages/icons';

const columns: Columns<TestModuleItem>[] = [
  {
    dataIndex: 'method',
    tilte: 'Method',
  },
  {
    dataIndex: 'title',
    tilte: 'Title',
    render: data => <div className="text-left">{data.title}</div>,
  },
  {
    dataIndex: 'status',
    tilte: 'Status',
    render(data) {
      switch (data.status) {
        case 'loading':
          return <EosIconsBubbleLoading className="text-xl" />;
        case 'success':
          return <IxCertificateSuccessFilled className="text-xl text-green-500" />;
        case 'failed':
          return <div className="text-sm">{data.reason}</div>;
      }
    },
  },
];

type TestModulesTableProps = {
  className?: string;
  modules: TestModuleItem[];
};
export const TestModulesTable = ({ className, modules }: TestModulesTableProps) => {
  return <Table className={className} columns={columns} data={modules} />;
};
