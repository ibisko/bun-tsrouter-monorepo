import { cn } from '@/utils/cn';
import { useId } from 'react';

const inputSelfClass = cn(
  'min-w-0 outline-none',
  // 表单验证错误时
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  'text-sm md:text-sm placeholder:text-xs',
  'autofill:bg-transparent! autofill:text-red-500!',
  'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
  'selection:bg-primary selection:text-primary-foreground',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  'placeholder:text-muted-foreground',
);

/** 专为 <input/> <textarea/> 特质 */
export const inputClass = cn(
  inputSelfClass,
  'h-8 w-full px-3 py-1 rounded-md shadow-xs transition-[color,box-shadow]',
  'border border-input',
  'bg-transparent',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
);

export type InputProps = React.ComponentProps<'input'> & {
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};
export function Input({ className, onEnter, ...props }: InputProps) {
  const id = useId();
  return (
    <input
      id={id}
      className={cn(inputClass, className)}
      onKeyDown={e => {
        if (!onEnter) return;
        if (e.code === 'Enter') {
          onEnter(e);
        }
      }}
      {...props}
    />
  );
}

type InputGroupProps = InputProps & {
  prefixSlot?: React.ReactNode;
  suffixSlot?: React.ReactNode;
};
export function InputGroup({ className, prefixSlot, suffixSlot, onEnter, ...props }: InputGroupProps) {
  const id = useId();
  return (
    <div className={cn(inputClass, 'flex items-center', prefixSlot && 'pl-0', suffixSlot && 'pr-0', className)}>
      {prefixSlot}
      <input
        id={id}
        className={cn(inputSelfClass, 'flex-1')}
        onKeyDown={e => {
          if (!onEnter) return;
          if (e.code === 'Enter') {
            onEnter(e);
          }
        }}
        {...props}
      />
      {suffixSlot}
    </div>
  );
}
