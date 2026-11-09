import { createRoute } from '@tanstack/react-router';

import { mainLayoutRoute } from 'routes/root';

import Settings from './Settings';

export const settingsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/settings',
  component: Settings,
});

export default [settingsRoute];
