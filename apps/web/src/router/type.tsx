import { type RouteObject } from 'react-router-dom';

export type MenuItem = {
  label: string;
  children?: MenuItem[];
};

export type RouterModule = {
  [K in keyof RouteObject]?: K extends 'children' ? RouterModule[] : RouteObject[K];
} & {
  label?: string;
  hideMenu?: boolean;
};

export type MenuAndRouter = RouterModule;
