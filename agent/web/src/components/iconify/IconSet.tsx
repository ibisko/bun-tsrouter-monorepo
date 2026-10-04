import React, { useMemo, useRef } from 'react';
import { cn, TableFetchWaterfallGallery } from '@packages/ui';
import { IconifyApi } from './api';
import { Icon } from './Icon';

type IconSetProps = {
  className?: string;
  palette?: boolean;
  kw?: string;
  currentCategoryId?: number;
  currentTags: number[];
  currentIconSetIds: { id: number; name: string }[];
  onClick?: (data: TableItem) => void;
};

export const IconSetGallery = ({ className, palette, kw, currentCategoryId, currentTags, currentIconSetIds, onClick }: IconSetProps) => {
  return (
    <TableFetchWaterfallGallery<TableItem>
      className={cn('gap-2 grid-cols-1', className)}
      api={({ skip, take }) =>
        IconifyApi.iconSet.list.post({
          skip,
          take,
          kw,
          palette: palette,
          categoryId: currentCategoryId,
          tags: currentTags,
        })
      }
      render={data => <IconSetItem data={data} onClick={() => onClick?.(data)} current={!!currentIconSetIds.find(item => item.id === data.id)} />}
    />
  );
};

type TableItem = Awaited<ReturnType<typeof IconifyApi.iconSet.list.post>>['data'][number];

type IconSetItemProps = {
  data: TableItem;
  current?: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const IconSetItem = ({ data, current, onClick }: IconSetItemProps) => {
  const samplesWrapperRef = useRef<HTMLDivElement>(null);

  const samples = useMemo(() => {
    return (data.samples || []) as number[];
  }, []);

  return (
    <div
      className={cn('relative grid grid-cols-[1fr_auto] gap-6 p-2 rounded h-20', current ? 'bg-primary/40' : 'bg-background')}
      onClick={e => {
        const dom = e.target as HTMLDivElement;
        const samplesWrapperDom = samplesWrapperRef.current as HTMLDivElement;
        if (samplesWrapperDom.contains(dom)) return;
        onClick(e);
      }}>
      <div className="relative overflow-hidden">
        <div className="truncate">{data.name}</div>
        <div className="text-sm">{data.prefix}</div>
        <div className="mt-auto text-sm">{data._count.icons}</div>
      </div>

      <div className="grid grid-cols-3 gap-1" ref={samplesWrapperRef}>
        {samples.map(id => (
          <Icon className="size-6" id={id} key={id} />
        ))}
      </div>
    </div>
  );
};
