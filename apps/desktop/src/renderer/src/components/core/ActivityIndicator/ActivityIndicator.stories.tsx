import type { Meta, StoryObj } from '@storybook/react';

import ActivityIndicator from './ActivityIndicator';

const meta: Meta<typeof ActivityIndicator> = {
  component: ActivityIndicator,
  title: 'Core/ActivityIndicator',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ActivityIndicator>;

export const Default: Story = {};
export const Tertiary: Story = { args: { color: 'textTertiary' } };
export const Large: Story = { args: { size: 24, color: 'buttonPrimary' } };
