import type { Meta, StoryObj } from '@storybook/react';

import { ArrowRightIcon, CheckIcon } from 'components/Icons';

import Button from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Core/Button',
  tags: ['autodocs'],
  args: { label: 'Save highlight', variant: 'primary', size: 'medium' },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', label: 'Cancel' } };
export const Ghost: Story = { args: { variant: 'ghost', label: 'Open notes' } };
export const Success: Story = { args: { variant: 'success', label: 'Synced' } };
export const Error: Story = { args: { variant: 'error', label: 'Delete' } };

export const Small: Story = { args: { size: 'small' } };
export const Large: Story = { args: { size: 'large' } };

export const WithLeftIcon: Story = { args: { leftIcon: CheckIcon } };
export const WithRightIcon: Story = {
  args: { variant: 'secondary', label: 'Open source', rightIcon: ArrowRightIcon },
};

export const Loading: Story = { args: { loading: true, label: 'Saving…' } };
export const Disabled: Story = { args: { disabled: true } };
export const Block: Story = { args: { block: true, label: 'Sign in' } };
