import { MainMenu } from './menus';
import { cn } from '@packages/ui';
import { createLazyRoute, Outlet } from '@tanstack/react-router';
// import { adminStore, logoutAction } from '@/stores/admin';
// import { useSnapshot } from 'valtio';
// import { setVisibleMenu, themeStore } from '@/stores/theme';

const MainLayout = () => {
  //   const { visibleMenu } = useSnapshot(themeStore);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* 左侧菜单 */}
      {/* <MainMenu visible={visibleMenu} setVisible={setVisibleMenu} /> */}
      <MainMenu />

      {/* 右侧面板 */}
      <div
        className={cn(
          'relative flex-1 flex flex-col overflow-hidden bg-background left-0 scale-100 transition sm:pr-4 sm:pb-4',
          'sm:scale-100 sm:left-0',
        )}>
        {/* 主面板 */}
        {/* <div className="relative flex-1 bg-sidebar-accent sm:rounded-2xl overflow-y-auto overflow-x-hidden"> */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyRoute('/app')({
  component: MainLayout,
});
