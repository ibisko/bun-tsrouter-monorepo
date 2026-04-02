import { router } from '@/router/rootRoute';
import { themeActions } from '@/stores/theme';
import { Button } from '@packages/ui';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

type MenuItem = { path: string; title?: string };
export const MainMenu = () => {
  const navigate = useNavigate();

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
          <Button onClick={() => navigate({ to: item.path })} key={item.path} link>
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
