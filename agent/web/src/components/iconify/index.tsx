import { Button, cn, Popover } from '@packages/ui';
import { LineMdIconify2StaticTwotone } from '@packages/icons';
import { IconifyPopoverContent } from './IconifyPopoverContent';

type IconifyProps = {
  className?: string;
};
export const Iconify = ({ className }: IconifyProps) => {
  return (
    <Popover
      className={cn('w-80 h-135 backdrop-blur-md border rounded-xl shadow-xl', className)}
      trigger={
        <Button size="icon-sm">
          <LineMdIconify2StaticTwotone className="size-5" />
        </Button>
      }
      side="right"
      align="start">
      <IconifyPopoverContent className="overflow-auto" />
    </Popover>
  );
};
