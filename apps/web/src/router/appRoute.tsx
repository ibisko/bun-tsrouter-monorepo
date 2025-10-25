import { userActions } from '@/stores/user';
import { RootRoute, createRoute, redirect } from '@tanstack/react-router';
// import { adminStore, initAdminAction } from '@/stores/admin';
// import { NotFindPage } from '@/layouts/main/NotFindPage';

export const createAppRoute = (rootRoute: RootRoute) => {
  const appRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/manage',
    async beforeLoad(ctx) {
      await userActions.initUserInfo();
      // 重定向
      if (/^\/manage\/?$/.test(ctx.location.pathname)) {
        throw redirect({ to: '/manage/user', replace: true });
      }
    },
    notFoundComponent: () => <div>404 not find</div>,
  }).lazy(() => import('@/layouts/manage').then(r => r.Route));

  const userRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/user',
  }).lazy(() => import('@/pages/user').then(r => r.Route));

  const logRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/log',
    // beforeLoad() {
    //   if (!adminStore.role || !['ROOT', 'ADMIN'].includes(adminStore.role)) {
    //     throw redirect({ to: '/manage/parent', replace: true });
    //   }
    // },
  }).lazy(() => import('@/pages/log').then(r => r.Route));

  return appRoute.addChildren([userRoute, logRoute]);
};
