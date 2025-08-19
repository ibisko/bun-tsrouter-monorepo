import { cn } from '@/utils/cn';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}
export const Button = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button className={cn('bg-gray-100 px-1.5 py-0.5 rounded shadow cursor-pointer', className)} {...props}>
      {children}
    </button>
  );
};
