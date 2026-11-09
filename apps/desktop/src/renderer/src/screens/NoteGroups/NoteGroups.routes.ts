import { createRoute } from '@tanstack/react-router';

import { mainLayoutRoute } from 'routes/root';

import NoteGroups from './NoteGroups';
import NoteGroupDetail from './views/NoteGroupDetail';

export const noteGroupsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/groups',
  component: NoteGroups,
});

export const noteGroupDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/groups/$noteGroupId',
  component: NoteGroupDetail,
});

export default [noteGroupsRoute, noteGroupDetailRoute];
