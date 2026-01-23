import { cn } from '@/main';

type DescriptionsProps = {
  className?: string;
  thClassName?: string;
  data: DescriptionsData[];
  hideLine?: boolean;
  thWidth?: number;
};
export const Descriptions = ({ className, thClassName, data, hideLine, thWidth }: DescriptionsProps) => {
  return (
    <table className={cn(className)}>
      <tbody>
        {data.map(item => (
          <tr className={cn({ 'not-last:border-b': !hideLine })} key={item.title}>
            <th className={cn('px-2 py-1', thClassName)} style={{ width: thWidth ? `${thWidth}px` : 'auto' }}>
              {item.title}
            </th>
            <td className="px-2 py-1">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type DescriptionsData = {
  title: string;
  value: React.ReactNode;
};
