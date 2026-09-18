import { cn } from '@/main';

type HRProps = React.ComponentProps<'hr'>;

export const HR = ({ title, className, ...props }: HRProps) => {
  return (
    <div {...props} className={cn('relative', className)}>
      <hr />
      <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-background px-2 font-black">{title}</span>
    </div>
  );
};
