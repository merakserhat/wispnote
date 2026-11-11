import type { Meta, StoryObj } from '@storybook/react';

import Keycap from './Keycap';

const meta: Meta<typeof Keycap> = {
  component: Keycap,
  title: 'Core/Keycap',
  tags: ['autodocs'],
  args: { glyph: '⌃', label: 'control' },
};

export default meta;

type Story = StoryObj<typeof Keycap>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'small', glyph: undefined, label: '⌃1' } };
export const Large: Story = { args: { size: 'large' } };
export const Shift: Story = { args: { glyph: '⇧', label: 'shift' } };
export const LabelOnly: Story = { args: { glyph: undefined, label: 'esc' } };
