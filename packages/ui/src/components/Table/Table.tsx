import { cn } from '@/main';
import type { Columns } from './type';

type TableProps = {
  className?: string;
  thClassName?: string;
  tdClassName?: string;
  /** 默认是id */
  primaryKey?: string;
  data?: Record<string, any>[];
  columns: Columns[];
  onRowClick?: (data: any) => void;
};
export const Table = ({ className, thClassName, tdClassName, primaryKey = 'id', data, columns, onRowClick }: TableProps) => {
  return (
    <div className={cn('relative rounded p-2 shadow overflow-auto', className)}>
      <table className={cn('text-center')}>
        <thead>
          <tr className="border-b">
            {columns.map(column => (
              <th key={column.dataIndex}>
                <div className={cn('p-2 pt-0 text-nowrap', thClassName)} style={{ width: column.width !== undefined ? `${column.width}px` : 'auto' }}>
                  {column.tilte}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="">
          {data?.map(item => (
            <tr className={cn('border-b')} onClick={() => onRowClick?.(item)} key={item[primaryKey]}>
              {columns.map(column => {
                return (
                  <td key={column.dataIndex}>
                    <div className={cn('p-2', tdClassName)}>{column.render ? column.render(item) : item[column.dataIndex]}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
