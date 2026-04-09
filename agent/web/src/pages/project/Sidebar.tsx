import { Iconify } from '@/components/iconify';
import { themeActions } from '@/stores/theme';
import { FluentDarkTheme24Filled } from '@packages/icons';
import { Button } from '@packages/ui';

export const Sidebar = () => {
  return (
    <div className="flex flex-col items-center gap-2 px-1 py-4 text-xl border-r">
      <Iconify />

      <div className="mt-auto">
        <Button className="" variant="ghost" size="icon-sm" onClick={themeActions.switchTheme}>
          <FluentDarkTheme24Filled className="size-5" />
        </Button>
      </div>
    </div>
  );
};
