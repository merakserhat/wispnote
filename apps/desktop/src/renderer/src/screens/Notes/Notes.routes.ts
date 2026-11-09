import { createRoute } from '@tanstack/react-router';

import { mainLayoutRoute } from 'routes/root';

import Notes from './Notes';

export const notesRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/notes',
  component: Notes,
});

export default [notesRoute];
