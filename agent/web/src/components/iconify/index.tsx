import { Button, cn, Popover } from '@packages/ui';
import { IconSets } from './IconSets';
import { LocalIcons } from './LocalIcons';
import { IconSearch } from './IconSearch';
import { LineMdIconify2StaticTwotone } from '@packages/icons';
import { useState } from 'react';

type IconifyProps = {
  className?: string;
};
export const Iconify = ({ className }: IconifyProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      className={cn('w-80 h-135 backdrop-blur-md border rounded-xl shadow-xl overflow-auto', className)}
      trigger={
        <Button variant={visible ? 'default' : 'ghost'} size="icon-sm">
          <LineMdIconify2StaticTwotone className="size-5" />
        </Button>
      }
      open={visible}
      onOpenChange={setVisible}
      sideOffset={10}
      side="right"
      align="start">
      <LocalIcons />
      <IconSearch />
      <IconSets />
    </Popover>
  );
};
