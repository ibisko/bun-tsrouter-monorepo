import { cn } from '@packages/ui';
import { IconSets } from './IconSets';
import { LocalIcons } from './LocalIcons';
import { IconSearch } from './IconSearch';

type IconifyProps = {
  className?: string;
};
export const Iconify = ({ className }: IconifyProps) => {
  // todo icon图标展开
  return (
    <div className={cn('absolute top-4 right-4 bg-background/80 backdrop-blur-md border rounded-xl shadow overflow-hidden', className)}>
      <div className="w-80 h-[540px] overflow-auto">
        <LocalIcons />
        <IconSearch />
        <IconSets />
      </div>
    </div>
  );
};
