import { cn } from '@/main';

export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card" className={cn('flex flex-col gap-4 bg-card p-4 rounded-xl border shadow-sm text-card-foreground', className)} {...props} />
  );
}
