import { Button, cn } from '@/main';
import { Popover } from '../Popover';
import { useMemo, useState } from 'react';

type LableItem = {
  label: React.ReactNode;
  value: any;
};
type GroupItem = { groupName: string; children: LableItem[] };
type SelectOption = LableItem | GroupItem;

type MultiSelectProps = {
  className?: string;
  options?: SelectOption[];
  side?: Parameters<typeof Popover>[number]['side'];
  align?: Parameters<typeof Popover>[number]['align'];
  sideOffset?: number;
  placeholder?: string;
  value?: any[];
  onChange?: (vals: any[]) => void;
};
export const MultiSelect = ({ className, options, side, align = 'start', sideOffset = 4, placeholder, value = [], onChange }: MultiSelectProps) => {
  const [visible, setVisible] = useState(false);

  // 把 options 拍平成 value -> label 的映射，用于渲染已选标签和判断选中态
  const labelMap = useMemo(() => {
    const map = new Map<any, LableItem>();
    for (const item of options ?? []) {
      const keys = Object.keys(item);
      if (keys.includes('label') && keys.includes('value')) {
        map.set((item as LableItem).value, item as LableItem);
      } else if (keys.includes('groupName') && keys.includes('children')) {
        for (const child of (item as GroupItem).children) map.set(child.value, child);
      }
    }
    return map;
  }, [options]);

  const toggle = (v: any) => {
    onChange?.(value.includes(v) ? value.filter(item => item !== v) : [...value, v]);
  };

  return (
    <Popover
      className={cn(
        'bg-popover text-popover-foreground relative z-50 overflow-x-hidden overflow-y-auto rounded-md shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      )}
      trigger={
        // 触发组件
        <div
          className={cn(
            'border-input min-h-7 min-w-10',
            "data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground",
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50',
            'focus-visible:border-ring focus-visible:ring-ring/50',
            'flex flex-wrap w-fit items-center gap-1 rounded-md border bg-transparent px-2 py-1 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ',
            // 'data-[size=default]:h-9 data-[size=sm]:h-8',
            '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            className,
          )}>
          {!value.length && <div className="text-foreground/40">{placeholder}</div>}
          {value.map(v => (
            <div className="bg-input px-1.5 rounded" key={v}>
              {labelMap.get(v)?.label}
            </div>
          ))}
        </div>
      }
      open={visible}
      onOpenChange={setVisible}
      sideOffset={sideOffset}
      side={side}
      align={align}>
      {/* 展开内容 */}
      <div className="flex flex-col gap-0.5 p-1">
        {options?.map(item => {
          const keys = Object.keys(item);
          if (keys.includes('label') && keys.includes('value')) {
            const labelItem = item as LableItem;
            return (
              <ContentItem key={labelItem.value} focus={value.includes(labelItem.value)} onClick={() => toggle(labelItem.value)}>
                {labelItem.label}
              </ContentItem>
            );
          }
          // 分组情况
          else if (keys.includes('groupName') && keys.includes('children')) {
            const groupItem = item as GroupItem;
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
      </div>
    </Popover>
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
