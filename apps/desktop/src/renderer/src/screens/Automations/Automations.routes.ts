import { createRoute } from '@tanstack/react-router';

import { mainLayoutRoute } from 'routes/root';

import Automations from './Automations';

export const automationsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/automations',
  component: Automations,
});

export default [automationsRoute];
