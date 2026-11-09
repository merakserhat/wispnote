import { createRoute } from '@tanstack/react-router';

import { mainLayoutRoute } from 'routes/root';

import Sources from './Sources';

export const sourcesRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/sources',
  component: Sources,
});

export default [sourcesRoute];
