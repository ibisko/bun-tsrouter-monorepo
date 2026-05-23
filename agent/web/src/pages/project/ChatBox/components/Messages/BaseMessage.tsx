import { cn, Reveal } from '@packages/ui';
import { useMemo } from 'react';

type BaseMessageProps = {
  className?: string;
  created: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side: 'left' | 'mid' | 'right';
};

export const BaseMessage = ({ className, created, children, footer, side }: BaseMessageProps) => {
  const dateString = useMemo(() => new Date(created).toLocaleString(), [created]);

  return (
    <div className={cn('relative flex flex-col justify-end px-1.5 py-1 group hover:bg-foreground/5')}>
      {created && (
        <Reveal
          className={cn(
            'text-nowrap  text-xs text-foreground/80',
            'group-hover:opacity-100 group-hover:grid-rows-[1fr]',
            { 'text-center': side === 'mid' },
            { 'text-right': side === 'right' },
          )}
          innerClassName={cn()}>
          {dateString}
        </Reveal>
      )}

      <div
        className={cn(
          'rounded-lg p-2 max-w-full',
          { 'mr-auto': side === 'left' },
          { 'mx-auto': side === 'mid' },
          { 'ml-auto': side === 'right' },
          className,
        )}>
        {children}
      </div>

      <Reveal
        className={cn(
          'text-nowrap text-xs text-foreground/80',
          'group-hover:opacity-100 group-hover:grid-rows-[1fr]',
          { 'mr-auto': side === 'left' },
          { 'mx-auto': side === 'mid' },
          { 'ml-auto': side === 'right' },
        )}
        innerClassName="flex gap-2 pt-1">
        {footer}
      </Reveal>
      {/* todo tools */}
    </div>
  );
};
