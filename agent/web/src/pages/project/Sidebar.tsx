import { themeActions } from '@/stores/theme';
import { FluentDarkTheme24Filled, MaterialSymbolsIframeOutlineRounded, PhReadCvLogo } from '@packages/icons';

export const Sidebar = () => {
  return (
    <div className="flex flex-col items-center py-4 text-xl border-r">
      <div className="p-2 cursor-pointer hover:bg-foreground/10">
        <MaterialSymbolsIframeOutlineRounded />
      </div>
      <div className="p-2 cursor-pointer hover:bg-foreground/10">
        <PhReadCvLogo />
      </div>

      <div className='mt-auto'>
        <div className="mt-auto" onClick={themeActions.switchTheme}>
          <FluentDarkTheme24Filled className="size-5" />
        </div>
      </div>
    </div>
  );
};
