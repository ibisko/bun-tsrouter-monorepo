import { router } from '@/router/rootRoute';
import { themeActions } from '@/stores/theme';
import { MaterialSymbolsIframeOutlineRounded, PhReadCvLogo } from '@packages/icons';
import { Button } from '@packages/ui';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

type MenuItem = { path: string; title?: string };

const MapMenuItemIcon: Record<string, React.ReactNode> = {
  '/app/iframe': <MaterialSymbolsIframeOutlineRounded />,
  '/app/log': <PhReadCvLogo />,
};

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
    <div className="flex flex-col p-4">
      <div className="flex flex-col gap-2">
        {menus.map(item => (
          <Button
            variant={location.pathname === item.path ? 'default' : 'ghost'}
            onClick={() => navigate({ to: item.path })}
            key={item.path}
            size="sm"
            link>
            {MapMenuItemIcon[item.path] || null}
            {item.title}
          </Button>
        ))}
      </div>

      <Button className="mt-auto" onClick={themeActions.switchTheme}>
        切换主题
      </Button>
    </div>
  );
};
