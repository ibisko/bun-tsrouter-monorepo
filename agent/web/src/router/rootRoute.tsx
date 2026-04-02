import { Outlet, RootRoute, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { createAppRoute } from './appRoute';
import LoginPage from '@/pages/home';
// import { createWhiteListRoute } from './whiteListRoute';

export const rootRoute: RootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" richColors />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
  notFoundComponent: () => <div>404 not find</div>,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  // ...createWhiteListRoute(rootRoute),
  createAppRoute(rootRoute),
]);

export const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});
