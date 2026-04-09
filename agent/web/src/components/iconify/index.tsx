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
      trigger={
        <Button variant={visible ? 'default' : 'ghost'} size="icon-sm">
          <LineMdIconify2StaticTwotone className="size-5" />
        </Button>
      }
      open={visible}
      onOpenChange={setVisible}
      side="right"
      align="start">
      <IconifyBox />
    </Popover>
  );
};

type IconifyBoxProps = {
  className?: string;
};
export const IconifyBox = ({ className }: IconifyBoxProps) => {
  return (
    <div className={cn('bg-background/95 backdrop-blur-md border rounded-xl shadow-xl overflow-hidden', className)}>
      <div className="w-80 h-[540px] overflow-auto">
        <LocalIcons />
        <IconSearch />
        <IconSets />
      </div>
    </div>
  );
};
