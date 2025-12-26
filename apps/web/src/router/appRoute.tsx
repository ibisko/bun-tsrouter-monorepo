import { userActions } from '@/stores/user';
import { RootRoute, createRoute, redirect } from '@tanstack/react-router';

export const createAppRoute = (rootRoute: RootRoute) => {
  const appRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/app',
    async beforeLoad(ctx) {
      await userActions.initUserInfo();
      // 重定向
      if (/^\/app\/?$/.test(ctx.location.pathname)) {
        throw redirect({ to: '/app/user', replace: true });
      }
    },
    notFoundComponent: () => <div>404 not find</div>,
  }).lazy(() => import('@/layouts/app').then(r => r.Route));

  const componentsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/components',
    staticData: { title: '组件' },
  }).lazy(() => import('@/pages/components').then(r => r.Route));

  const userRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/user',
    staticData: { title: '用户' },
  }).lazy(() => import('@/pages/user').then(r => r.Route));

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

  return appRoute.addChildren([componentsRoute, userRoute, logRoute, tsRouter]);
};
