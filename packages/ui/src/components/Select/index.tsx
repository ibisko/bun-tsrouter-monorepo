import React, { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { usePopover } from '@/components/Popover/usePopover';
import { PopoverContent } from '@/components/Popover/popverContent';
import { LucideChevronDown, LucideX } from '@packages/icons';
import type { Align, Side } from '@/components/Popover/type';

type Value = React.Attributes['key'];

type LableItem<T extends Value> = {
  label: React.ReactNode;
  value: T;
};

type SelectProps<T extends Value> = {
  className?: string;
  defaultValue?: T;
  value?: T;
  placeholder?: string;
  side?: Side;
  align?: Align;
  offset?: number;
  options: LableItem<T>[];
  clearable?: boolean;
  onChange?: (param: T) => void;
};
export const Select = <T extends Value>({
  className,
  placeholder,
  value,
  defaultValue,
  options,
  clearable = true,
  side = 'bottom',
  align = 'center',
  offset = 8,
  onChange,
}: SelectProps<T>) => {
  const { triggerRef, visible, onTrigger, setVisible, ...props } = usePopover({ side, align, offset });

  const triggerValue = useMemo(() => {
    if (!options) return;
    const target = options.find(item => item.value === value);
    if (target) return target.label;
  }, [value, options]);

  return (
    <>
      <div
        className={cn(
          'flex items-center text-sm font-normal rounded-md border text-nowrap min-h-8',
          'ring-0 transition ring-ring/50 ',
          visible && 'ring-[3px] border-ring',
        )}
        ref={triggerRef}
        onClick={onTrigger}>
        <div className="pl-2.5 pr-1.5 py-1 min-w-30">
          {triggerValue}
          {!triggerValue && <div className="text-muted-foreground select-none">{placeholder}</div>}
        </div>

        <div className="flex items-center gap-1 py-1.5 pr-1.5">
          {clearable && (defaultValue ? value !== defaultValue : !!triggerValue) ? (
            <LucideX
              className="size-4 rounded text-muted-foreground hover:bg-accent text-xs cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                onChange?.(defaultValue as any);
              }}
            />
          ) : (
            <LucideChevronDown className="size-4" />
          )}
        </div>
      </div>

      {visible && (
        <PopoverContent
          className={cn(
            'flex flex-col gap-0.5 p-1 overflow-hidden rounded-md ring-1 ring-foreground/10 shadow-md',
            'bg-popover/95 backdrop-blur-[2px] text-popover-foreground',
            className,
          )}
          {...props}>
          {options?.map(item => (
            <div
              className={cn('px-2 py-1.5 hover:bg-accent rounded-[6px] cursor-pointer', value === item.value && 'bg-accent')}
              onClick={() => {
                onChange?.(item.value);
                setVisible(false);
              }}
              key={item.value}>
              {item.label}
            </div>
          ))}
        </PopoverContent>
      )}
    </>
  );
};
