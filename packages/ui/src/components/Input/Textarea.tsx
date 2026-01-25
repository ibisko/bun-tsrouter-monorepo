import { cn, inputClass } from '@/main';

type TextareaProps = React.ComponentProps<'textarea'>;
export function Textarea({ className, rows = 3, ...props }: TextareaProps) {
  return <textarea className={cn(inputClass, 'h-auto', className)} rows={rows} {...props} />;
}
