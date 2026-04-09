import { Iconify } from '@/components/iconify';
import { cn } from '@packages/ui';

type SidebarToolsProps = {
  className?: string;
};
export const SidebarTools = ({ className }: SidebarToolsProps) => {
  return (
    <div className={cn('flex flex-col py-4', className)}>
      <Iconify />
    </div>
  );
};
