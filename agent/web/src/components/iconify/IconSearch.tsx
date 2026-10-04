import { IconifyApi } from './api';
import { Icon } from './Icon';
import { iconifyAction } from './action';
import { BubblesAddOutline } from '@packages/icons';
import { cn, ContextMenu, TableFetchWaterfallGallery } from '@packages/ui';
import { camelCase } from 'lodash-es';
import { toast } from 'sonner';

type IconSearchProps = {
  className?: string;
  searchKw: string;
  palette?: boolean;
  currentCategoryId?: number | null;
  currentTags: number[];
  currentIconSetIds: number[];
};

export const IconSearch = ({ className, searchKw, palette, currentCategoryId, currentTags, currentIconSetIds, ...props }: IconSearchProps) => {
  return (
    <TableFetchWaterfallGallery<TableItem>
      {...props}
      key={searchKw}
      take={100}
      className={cn('gap-6 grid-cols-6', className)}
      api={({ skip, take }) =>
        IconifyApi.icon.list.post({
          skip,
          take,
          kw: searchKw,
          palette: palette,
          categoryId: currentCategoryId,
          tags: currentTags,
          iconSets: currentIconSetIds,
        })
      }
      render={data => <SearchItem data={data} />}
    />
  );
};

type TableItem = Awaited<ReturnType<typeof IconifyApi.icon.list.post>>['data'][number];

type SearchItemProps = {
  data: TableItem;
};

const SearchItem = ({ data }: SearchItemProps) => {
  const appendIcon = async () => {
    const res = await iconifyAction.getIconInfo({ id: data.id });
    if (!res) return;
    await IconifyApi.iconifyLocal.appendIcon.post({
      sign: `${res.prefix}:${res.name}`,
      body: res.body,
      top: data.top,
      left: data.left,
      width: data.width,
      height: data.height,
    });
    const camel = camelCase(res.name);
    const fileName = camel.slice(0, 1).toUpperCase() + camel.slice(1);
    toast.success(`添加图标成功 ${fileName}.tsx`);
  };

  return (
    <ContextMenu
      menus={[
        {
          key: 1,
          title: 'Add',
          suffix: <BubblesAddOutline />,
          onClick: appendIcon,
        },
      ]}>
      <Icon id={data.id} />
    </ContextMenu>
  );
};
