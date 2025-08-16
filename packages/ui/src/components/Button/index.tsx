import { cn } from '@/utils/cn';

type ButtonProps = {
  className?: string;
  children?: React.ReactNode;
};
export const Button = ({ className, children }: ButtonProps) => {
  return <div className={cn('', className)}>{children}</div>;
};
