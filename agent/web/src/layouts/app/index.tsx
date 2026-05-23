import { cn, TooltipProvider } from '@packages/ui';
import { createLazyRoute, Outlet } from '@tanstack/react-router';

const MainLayout = () => {
  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* 右侧主界面 */}
        <div className={cn('relative flex-1 flex flex-col overflow-hidden bg-background left-0 scale-100 transition')}>
          <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export const Route = createLazyRoute('/app')({
  component: MainLayout,
});
