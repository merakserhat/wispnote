import type { Meta, StoryObj } from '@storybook/react';

import Text from 'components/core/Text';

import Card from './Card';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Core/Card',
  tags: ['autodocs'],
  args: {
    variant: 'flat',
    p: 'm',
    gap: 'xs',
    width: 260,
    children: (
      <>
        <Text variant="label" color="textTertiary">
          PDF
        </Text>
        <Text variant="subtitle">Thinking in Systems</Text>
        <Text variant="mono" color="textTertiary" numberOfLines={1}>
          thinking-in-systems.pdf
        </Text>
        <Text variant="bodySub" color="textSecondary" mt="xs">
          2 notes · 240 pages
        </Text>
      </>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Flat: Story = {};
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Elevated: Story = { args: { variant: 'elevated' } };
