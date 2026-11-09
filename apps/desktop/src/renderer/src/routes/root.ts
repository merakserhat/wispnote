import { createRootRouteWithContext, createRoute, redirect } from '@tanstack/react-router';

import AuthLayout from 'layouts/AuthLayout';
import MainLayout from 'layouts/MainLayout';
import RootLayout from 'layouts/RootLayout';

import { TRouterContext } from './routes.types';

export const rootRoute = createRootRouteWithContext<TRouterContext>()({
  component: RootLayout,
});

export const mainLayoutRoute = createRoute({
  id: 'main-layout',
  getParentRoute: () => rootRoute,
  component: MainLayout,
});

export const authLayoutRoute = createRoute({
  id: 'auth-layout',
  getParentRoute: () => rootRoute,
  component: AuthLayout,
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/notes', replace: true });
  },
});
