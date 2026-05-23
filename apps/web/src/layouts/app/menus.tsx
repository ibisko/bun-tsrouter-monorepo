import { router } from '@/router/rootRoute';
import { themeActions } from '@/stores/theme';
import { FluentDarkTheme24Filled } from '@packages/icons';
import { Button } from '@packages/ui';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

type MenuItem = { path: string; title?: string };
export const MainMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menus, setMenus] = useState<MenuItem[]>([]);
  useEffect(() => {
    const menus: MenuItem[] = [];
    router.routeTree.children?.forEach(child => {
      if (child.id !== '/app') return;
      child.children?.forEach(item => {
        menus.push({ path: item.id, title: item.options.staticData?.title });
      });
    });
    setMenus(menus);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        {menus.map(item => (
          <Button
            variant={location.pathname === item.path ? 'default' : 'ghost'}
            onClick={() => navigate({ to: item.path })}
            key={item.path}
            size="sm"
            link>
            {item.title}
          </Button>
        ))}
      </div>

      <Button className="mt-auto" variant="ghost" size="icon-sm" onClick={themeActions.switchTheme}>
        <FluentDarkTheme24Filled className="size-5" />
      </Button>
    </div>
  );
};
