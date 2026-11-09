import authRoutes from 'screens/Auth/Auth.routes';
import automationsRoutes from 'screens/Automations/Automations.routes';
import noteGroupsRoutes from 'screens/NoteGroups/NoteGroups.routes';
import notesRoutes from 'screens/Notes/Notes.routes';
import settingsRoutes from 'screens/Settings/Settings.routes';
import sourcesRoutes from 'screens/Sources/Sources.routes';

import { authLayoutRoute, indexRoute, mainLayoutRoute, rootRoute } from './root';

export const routeTree = rootRoute.addChildren([
  indexRoute,
  mainLayoutRoute.addChildren([
    ...notesRoutes,
    ...noteGroupsRoutes,
    ...sourcesRoutes,
    ...automationsRoutes,
    ...settingsRoutes,
  ]),
  authLayoutRoute.addChildren([...authRoutes]),
]);
