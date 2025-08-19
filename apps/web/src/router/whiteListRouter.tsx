// import ProtectedPage from "@/page/protected";
import type { RouteObject } from 'react-router-dom';
import WhiteList1 from '@pages/whiteList1';

/** 白名单路由 */
export const whiteListRouter: RouteObject[] = [
  {
    path: '/protected',
    Component: WhiteList1,
  },
];

function parseWhiteListRouterPath(routers: RouteObject[], prefix: string = '') {
  const paths: string[] = [];
  for (const item of routers) {
    if (!item.path) continue;
    const _path = item.path.startsWith('/') ? item.path : `/${item.path}`;
    const abspath = prefix + _path;
    paths.push(abspath);
    if (item.children && item.children.length) {
      const _paths = parseWhiteListRouterPath(item.children, abspath);
      paths.push(..._paths);
    }
  }
  return paths;
}

export const whiteList = [...parseWhiteListRouterPath(whiteListRouter)];
