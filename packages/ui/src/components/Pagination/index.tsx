import { cn } from '@/main';
import { Button } from '@/components/Button';

type PaginationProps = {
  className?: string;
  skip: number;
  take: number;
  total: number;
  onChange: (skip: number) => void;
};

export const Pagination = ({ className, skip, take, total, onChange }: PaginationProps) => {
  const previous = () => {
    if (skip - take < 0) return;
    onChange(skip - take);
  };
  const next = () => {
    if (skip + take >= total) return;
    onChange(skip + take);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button className="px-1.5 py-1 h-auto" variant="ghost" size="sm" onClick={previous}>
        Previous
      </Button>
      <div>
        {~~(skip / take) + 1} / {Math.ceil(total / take)}
      </div>
      {/* <div>{take}</div> */}
      {/* <div>{total}</div> */}
      <Button className="px-1.5 py-1 h-auto" variant="ghost" size="sm" onClick={next}>
        Next
      </Button>
    </div>
  );
};
