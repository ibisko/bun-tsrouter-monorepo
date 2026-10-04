import { cn, ContextMenu, TableFetchWaterfallGallery } from '@packages/ui';
import { Icon } from './Icon';
import { CustomVSCode } from '@packages/icons';
import { Api } from '@/api';

type LocalIconProps = {
  className?: string;
};

export const LocalIcon = ({ className }: LocalIconProps) => {
  return (
    <TableFetchWaterfallGallery<TableItem>
      className={cn('gap-6 grid-cols-6', className)}
      keyField="sign"
      api={({ skip, take }) => Api.iconifyLocal.listIcon.post({ skip, take })}
      render={data => <LocalIconItem data={data} />}
    />
  );
};

type TableItem = Awaited<ReturnType<typeof Api.iconifyLocal.listIcon.post>>['data'][number];

type LocalIconItemProps = {
  data: TableItem;
};

const LocalIconItem = ({ data }: LocalIconItemProps) => {
  return (
    <ContextMenu
      menus={[
        {
          key: '2',
          title: 'open in vscode',
          suffix: <CustomVSCode />,
          async onClick(hideMenu) {
            window.location.assign(`vscode://file/${data.filePath}`);
            hideMenu();
          },
        },
      ]}>
      <Icon fileName={data.fileName} />
    </ContextMenu>
  );
};
