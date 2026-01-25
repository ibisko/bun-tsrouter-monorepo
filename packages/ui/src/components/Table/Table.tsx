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
    <div className={cn('rounded overflow-auto', className)}>
      <table className={cn('text-center')}>
        <thead>
          <tr className="border-b">
            {columns.map(column => (
              <th
                className={cn('bg-foreground/10 backdrop-blur-xs', column.fixed ? 'sticky' : 'relative')}
                style={{
                  [column.fixed || 'left']: column.fixed ? `${column.stickyOffset}px` : 'auto',
                }}
                key={column.dataIndex}>
                <div className={cn('p-2 text-nowrap', thClassName)} style={{ width: column.width !== undefined ? `${column.width}px` : 'auto' }}>
                  {column.tilte}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="">
          {data?.map(item => (
            <tr className={cn('relative border-b group')} onClick={() => onRowClick?.(item)} key={item[primaryKey]}>
              {columns.map(column => {
                return (
                  <td
                    className={cn('group-hover:bg-foreground/5 backdrop-blur-xs', column.fixed ? 'sticky' : 'relative')}
                    style={{
                      [column.fixed || 'left']: column.fixed ? `${column.stickyOffset}px` : 'auto',
                    }}
                    key={column.dataIndex}>
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
