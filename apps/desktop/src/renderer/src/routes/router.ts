import { createMemoryHistory, createRouter } from '@tanstack/react-router';

import { queryClient } from 'context/AllContextProvider';

import { routeTree } from './routeTree';

export const router = createRouter({
  routeTree,
  history: createMemoryHistory({ initialEntries: ['/'] }),
  context: { queryClient },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
