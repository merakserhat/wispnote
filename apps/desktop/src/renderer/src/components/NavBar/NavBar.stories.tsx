import type { Meta, StoryObj } from '@storybook/react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from 'context/AllContextProvider';
import NavigationProvider from 'context/NavigationProvider';
import NavItem from 'enums/NavItem';

import NavBar from './NavBar';
import { TNavBarProps } from './NavBar.types';

type TStoryProps = TNavBarProps & { initialItem: NavItem };

function NavBarInShell({ initialItem, ...props }: TStoryProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationProvider initialItem={initialItem}>
        <div style={{ display: 'flex', height: 560 }}>
          <NavBar {...props} />
        </div>
      </NavigationProvider>
    </QueryClientProvider>
  );
}

const meta: Meta<TStoryProps> = {
  component: NavBar,
  title: 'Components/NavBar',
  tags: ['autodocs'],
  render: NavBarInShell,
  args: { email: 'serhat@wamo.io', initialItem: NavItem.NOTES },
  argTypes: { initialItem: { control: 'select', options: Object.values(NavItem) } },
};

export default meta;

type Story = StoryObj<TStoryProps>;

export const Notes: Story = {};
export const Settings: Story = { args: { initialItem: NavItem.SETTINGS } };
export const LongEmail: Story = {
  args: { email: 'a.very.long.address.that.will.not.fit@example-company.io' },
};
