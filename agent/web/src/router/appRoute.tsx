import { RootRoute, createRoute, redirect } from '@tanstack/react-router';

export const createAppRoute = (rootRoute: RootRoute) => {
  const appRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/app',
    async beforeLoad(ctx) {
      // 重定向
      if (/^\/app\/?$/.test(ctx.location.pathname)) {
        throw redirect({ to: '/app/ts-router', replace: true });
      }
    },
    notFoundComponent: () => <div>404 not find</div>,
  }).lazy(() => import('@/layouts/app').then(r => r.Route));

  const iconifyRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/iconify',
    staticData: { title: 'iconify' },
  }).lazy(() => import('@/pages/iconify').then(r => r.Route));

  const logRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/log',
    staticData: { title: '日志' },
  }).lazy(() => import('@/pages/log').then(r => r.Route));

  const tsRouter = createRoute({
    getParentRoute: () => appRoute,
    path: '/ts-router',
    staticData: { title: 'tsRouter测试' },
  }).lazy(() => import('@/pages/tsRouter').then(r => r.Route));

  return appRoute.addChildren([iconifyRoute, logRoute, tsRouter]);
};
