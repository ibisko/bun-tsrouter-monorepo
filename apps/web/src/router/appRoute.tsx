import { userActions } from '@/stores/user';
import { RootRoute, createRoute, redirect } from '@tanstack/react-router';
// import { adminStore, initAdminAction } from '@/stores/admin';
// import { NotFindPage } from '@/layouts/main/NotFindPage';

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
  }).lazy(() => import('@/pages/components').then(r => r.Route));

  const userRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/user',
  }).lazy(() => import('@/pages/user').then(r => r.Route));

  const logRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/log',
    // beforeLoad() {
    //   if (!adminStore.role || !['ROOT', 'ADMIN'].includes(adminStore.role)) {
    //     throw redirect({ to: '/app/parent', replace: true });
    //   }
    // },
  }).lazy(() => import('@/pages/log').then(r => r.Route));

  return appRoute.addChildren([componentsRoute, userRoute, logRoute]);
};
