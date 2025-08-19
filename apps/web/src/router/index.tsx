import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import type { MenuAndRouter, MenuItem } from './type';
import { appRouter } from './appRouter';
import { whiteListRouter } from './whiteListRouter';
import { RootRouter } from './RootRouter';
import HomePage from '@/pages/home';

const myRouter: MenuAndRouter[] = [
  {
    path: '/',
    Component: RootRouter,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      ...whiteListRouter,
      ...appRouter,
    ],
  },
];

// const formatRouter = (routers: MenuAndRouter[]) => {
//   for (const item of routers) {
//     if (!item.HydrateFallback && !item.hydrateFallbackElement) {
//       item.hydrateFallbackElement = <></>;
//     }
//     if (item.children && item.children.length !== 0) {
//       formatRouter(item.children);
//     }
//   }
//   return routers;
// };
// const routers = formatRouter(myRouter) as RouteObject[];
// console.log('routers:', routers);

const createMenus = (routers: MenuAndRouter[]) => {
  const menus: MenuItem[] = [];
  for (const item of routers) {
    if (item.hideMenu) continue;
    if (item.label) {
      const menu: MenuItem = { label: item.label };
      if (item.children && item.children.length) {
        menu.children = createMenus(item.children);
      }
      menus.push(menu);
    }
  }
  return menus;
};

// const menus = createMenus(routers[0].children!);
// console.log('menus:', menus);

// export const router = createBrowserRouter(routers);

export const router = createBrowserRouter(myRouter as RouteObject[]);
