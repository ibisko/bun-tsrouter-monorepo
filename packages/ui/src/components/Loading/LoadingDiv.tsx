import { cn } from '@packages/ui';

type LoadingDivProps = {
  className?: string;
  loading?: boolean;
  children?: React.ReactNode;
  maskColor?: string;
  maskClassName?: string;
};
export const LoadingDiv = ({ className, loading, children, maskColor, maskClassName }: LoadingDivProps) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div
          className={cn('fixed z-10 top-0 left-0 leading-0 w-full h-full grid place-items-center', maskClassName)}
          style={{ background: maskColor }}>
          <div className="size-16 border-4 border-gray-300 border-t-green-600 rounded-full animate-ease-in-out"></div>
        </div>
      )}
    </div>
  );
};
