import { cn } from '@/utils/cn';

export const inputClass = cn(
  'h-9 w-full min-w-0 px-3 py-1 rounded-md shadow-xs transition-[color,box-shadow] outline-none',
  'bg-transparent dark:bg-input/30',
  'text-base md:text-sm',
  'border border-input',
  'placeholder:text-muted-foreground',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  'selection:bg-primary selection:text-primary-foreground',
  'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
);

export type InputProps = React.ComponentProps<'input'> & {
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};
export function Input({ className, type, onEnter, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(inputClass, className)}
      onKeyDown={e => {
        if (!onEnter) return;
        if (e.code === 'Enter') {
          onEnter(e);
        }
      }}
      {...props}
      // data-slot="input"
    />
  );
}

type InputGroupProps = InputProps & {
  prefixSlot?: React.ReactNode;
  suffixSlot?: React.ReactNode;
};
export function InputGroup({ className, prefixSlot, suffixSlot, onEnter, ...props }: InputGroupProps) {
  return (
    <div
      className={cn(
        inputClass,
        'flex items-center gap-2',
        'has-[[data-slot=input-group-control]:focus-visible]:border-ring',
        'has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50',
        'has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
        className,
      )}>
      {prefixSlot}
      <input
        className={cn('flex-1 h-full outline-none autofill:bg-transparent! autofill:text-red-500!')}
        onKeyDown={e => {
          if (!onEnter) return;
          if (e.code === 'Enter') {
            onEnter(e);
          }
        }}
        {...props}
        data-slot="input-group-control"
      />
      {suffixSlot}
    </div>
  );
}
