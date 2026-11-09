import { createContext, useContext } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import { queryClient } from 'context/AllContextProvider';
import NavItem, { TNavItemPath, getPathByNavItem } from 'enums/NavItem';

import NavBar from './NavBar';
import { TNavBarProps } from './NavBar.types';

type TStoryProps = TNavBarProps & { initialPath: TNavItemPath };

const StoryPropsContext = createContext<TNavBarProps>({ email: '' });

const storyRootRoute = createRootRoute({ component: StoryShell });

function StoryShell() {
  const props = useContext(StoryPropsContext);

  return (
    <div style={{ display: 'flex', height: 560 }}>
      <NavBar {...props} />
      <Outlet />
    </div>
  );
}

const storyRouteTree = storyRootRoute.addChildren(
  Object.values(NavItem).map((item) =>
    createRoute({ getParentRoute: () => storyRootRoute, path: getPathByNavItem(item) })
  )
);

function NavBarInShell({ initialPath, ...props }: TStoryProps) {
  const router = createRouter({
    routeTree: storyRouteTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <StoryPropsContext.Provider value={props}>
        <RouterProvider router={router} />
      </StoryPropsContext.Provider>
    </QueryClientProvider>
  );
}

const meta: Meta<TStoryProps> = {
  component: NavBar,
  title: 'Components/NavBar',
  tags: ['autodocs'],
  render: NavBarInShell,
  args: { email: 'serhat@wamo.io', initialPath: '/notes' },
  argTypes: {
    initialPath: { control: 'select', options: Object.values(NavItem).map(getPathByNavItem) },
  },
};

export default meta;

type Story = StoryObj<TStoryProps>;

export const Notes: Story = {};
export const Settings: Story = { args: { initialPath: '/settings' } };
export const LongEmail: Story = {
  args: { email: 'a.very.long.address.that.will.not.fit@example-company.io' },
};
