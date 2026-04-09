import { RootRoute, createRoute, redirect } from '@tanstack/react-router';

export const createAppRoute = (rootRoute: RootRoute) => {
  const appRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/app',
    async beforeLoad(ctx) {
      // 重定向
      if (/^\/app\/?$/.test(ctx.location.pathname)) {
        throw redirect({ to: '/app/iframe', replace: true });
      }
    },
    notFoundComponent: () => <div>404 not find</div>,
  }).lazy(() => import('@/layouts/app').then(r => r.Route));

  const logRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/log',
    staticData: { title: '日志' },
  }).lazy(() => import('@/pages/log').then(r => r.Route));

  const iframeRouter = createRoute({
    getParentRoute: () => appRoute,
    path: '/iframe',
    staticData: { title: 'iframe' },
  }).lazy(() => import('@/pages/iframe').then(r => r.Route));

  return appRoute.addChildren([iframeRouter, logRoute]);
};
