import { Button, cn } from '@packages/ui';
import { IconSets } from './IconSets';
import { LocalIcons } from './LocalIcons';
import { IconSearch } from './IconSearch';
import { LineMdIconify2StaticTwotone } from '@packages/icons';
import { useState } from 'react';

type IconifyProps = {
  className?: string;
};
export const Iconify = ({ className }: IconifyProps) => {
  // todo icon图标展开
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Button className="" variant={visible ? 'default' : 'ghost'} size="icon-sm" onClick={() => setVisible(e => !e)}>
        <LineMdIconify2StaticTwotone className="size-5" />
      </Button>

      {/* todo 应该点击空白地方就取消，也就是用dialog */}
      {visible && <IconifyBox className="absolute -top-2 right-12" />}
    </div>
  );
};

type IconifyBoxProps = {
  className?: string;
};
export const IconifyBox = ({ className }: IconifyBoxProps) => {
  // todo icon图标展开
  return (
    <div className={cn('bg-background/95 backdrop-blur-md border rounded-xl shadow overflow-hidden', className)}>
      <div className="w-80 h-[540px] overflow-auto">
        <LocalIcons />
        <IconSearch />
        <IconSets />
      </div>
    </div>
  );
};
