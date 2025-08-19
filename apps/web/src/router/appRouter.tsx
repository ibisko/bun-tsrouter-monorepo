import type { MenuAndRouter } from './type';

export const appRouter: MenuAndRouter[] = [
  {
    label: 'pg1',
    path: '/pg1',
    lazy: () => import('@pages/pg1/index.tsx').then(convert),
  },
];

function convert({ clientLoader, clientAction, ...rest }: any) {
  const Component = rest.default || rest.Component;
  return {
    ...rest,
    loader: clientLoader,
    action: clientAction,
    Component,
  };
}
