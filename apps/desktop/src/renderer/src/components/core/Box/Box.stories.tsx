import type { Meta, StoryObj } from '@storybook/react';

import Box from './Box';

const meta: Meta<typeof Box> = {
  component: Box,
  title: 'Core/Box',
  tags: ['autodocs'],
  args: {
    flexDirection: 'row',
    gap: 's',
    p: 'm',
    backgroundColor: 'backgroundPrimary',
    borderRadius: 10,
    width: 420,
    children: (
      <>
        <Box flex={1} height={20} backgroundColor="buttonGhost" borderRadius={4} />
        <Box flex={2} height={20} backgroundColor="buttonGhost" borderRadius={4} />
        <Box flex={1} height={20} backgroundColor="buttonGhost" borderRadius={4} />
      </>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof Box>;

export const Row: Story = {};
export const Column: Story = { args: { flexDirection: 'column' } };
export const Outlined: Story = {
  args: {
    backgroundColor: 'backgroundTertiary',
    borderColor: 'borderOutline',
    borderWidth: 1,
    borderStyle: 'solid',
  },
};
