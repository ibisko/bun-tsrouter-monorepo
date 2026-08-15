import { cn } from '@/utils/cn';
import { PopoverContent } from '@/components/Popover/popverContent';
import { useMemo } from 'react';
import { LucideChevronDown, LucideX } from '@packages/icons';
import { usePopover } from '@/components/Popover/usePopover';
import type { Align, Side } from '@/components/Popover/type';

type LableItem<T> = {
  label: React.ReactNode;
  value: any;
};
type GroupItem<T> = { groupName: string; children: LableItem<T>[] };
type SelectOption<T> = LableItem<T> | GroupItem<T>;

type MultiSelectProps<T> = {
  className?: string;
  options?: SelectOption<T>[];
  side?: Side;
  align?: Align;
  offset?: number;
  placeholder?: string;
  value?: any[];
  clearable?: boolean;
  onChange?: (vals: T[]) => void;
};
export const MultiSelect = <T = any,>({
  className,
  options,
  side = 'bottom',
  align = 'center',
  offset = 8,
  placeholder,
  value = [],
  clearable = true,
  onChange,
}: MultiSelectProps<T>) => {
  const { triggerRef, visible, onTrigger, setVisible, ...props } = usePopover({ side, align, offset });

  // 把 options 拍平成 value -> label 的映射，用于渲染已选标签和判断选中态
  const labelMap = useMemo(() => {
    const map = new Map<any, LableItem<T>>();
    for (const item of options ?? []) {
      const keys = Object.keys(item);
      if (keys.includes('label') && keys.includes('value')) {
        map.set((item as LableItem<T>).value, item as LableItem<T>);
      } else if (keys.includes('groupName') && keys.includes('children')) {
        for (const child of (item as GroupItem<T>).children) map.set(child.value, child);
      }
    }
    return map;
  }, [options]);

  const toggle = (v: any) => {
    onChange?.(value.includes(v) ? value.filter(item => item !== v) : [...value, v]);
  };

  return (
    <>
      <div
        className={cn(
          'flex text-sm font-normal rounded-md border text-nowrap min-h-8',
          'ring-0 transition ring-ring/50 ',
          visible && 'ring-[3px] border-ring',
          className,
        )}
        ref={triggerRef}
        onClick={onTrigger}>
        <div className="flex flex-wrap gap-1 pl-2.5 pr-1.5 py-1 min-w-30">
          {!value.length && <div className="text-muted-foreground">{placeholder}</div>}
          {value.map(v => (
            <div className="flex gap-1 items-center bg-input px-1.5 rounded" key={v}>
              {labelMap.get(v)?.label}
              <LucideX
                className="size-3.5 text-muted-foreground hover:text-accent cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  const vals = value.filter(item => item !== v);
                  onChange?.(vals);
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 py-1.5 pr-1.5">
          {clearable && !!value.length ? (
            <LucideX
              className="rounded text-muted-foreground hover:bg-accent text-xs size-4 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                onChange?.([]);
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
          )}
          {...props}>
          {/* 展开内容 */}
          {options?.map(item => {
            const keys = Object.keys(item);
            if (keys.includes('label') && keys.includes('value')) {
              const labelItem = item as LableItem<T>;
              return (
                <ContentItem key={labelItem.value} focus={value.includes(labelItem.value)} onClick={() => toggle(labelItem.value)}>
                  {labelItem.label}
                </ContentItem>
              );
            }

            // 分组情况
            else if (keys.includes('groupName') && keys.includes('children')) {
              const groupItem = item as GroupItem<T>;
              return (
                <div key={groupItem.groupName}>
                  {groupItem.children.map(child => (
                    <ContentItem key={child.value} focus={value.includes(child.value)} onClick={() => toggle(child.value)}>
                      {child.label}
                    </ContentItem>
                  ))}
                </div>
              );
            }
          })}
        </PopoverContent>
      )}
    </>
  );
};

type ContentItemProps = {
  className?: string;
  children: React.ReactNode;
  focus?: boolean;
  onClick?: () => void;
};
const ContentItem = ({ className, children, focus, onClick }: ContentItemProps) => {
  return (
    <div
      className={cn('flex items-center px-2 py-1 h-8 hover:bg-accent rounded-sm cursor-default', { 'bg-accent': focus }, className)}
      onClick={onClick}>
      {children}
    </div>
  );
};
