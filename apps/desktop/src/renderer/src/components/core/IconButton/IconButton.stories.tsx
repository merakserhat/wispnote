import type { Meta, StoryObj } from '@storybook/react';

import { ArrowRightIcon, Trash01Icon, XCloseIcon } from 'components/Icons';

import IconButton from './IconButton';

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  title: 'Core/IconButton',
  tags: ['autodocs'],
  args: { icon: XCloseIcon, variant: 'primary', size: 'medium' },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'secondary', outline: true } };
export const Ghost: Story = { args: { variant: 'ghost', icon: ArrowRightIcon } };
export const Error: Story = { args: { variant: 'error', icon: Trash01Icon } };

export const Small: Story = { args: { size: 'small' } };
export const Large: Story = { args: { size: 'large' } };

export const WithLabel: Story = {
  args: { variant: 'ghost', size: 'large', icon: ArrowRightIcon, label: 'Open source' },
};
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
