import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';

import SegmentedControl from './SegmentedControl';
import { TSegmentedControlProps } from './SegmentedControl.types';

type TStoryProps = TSegmentedControlProps<string>;

function ControlledSegmentedControl(props: TStoryProps) {
  const [{ value }, updateArgs] = useArgs<TStoryProps>();

  function handleChange(next: string) {
    updateArgs({ value: next });
  }

  return <SegmentedControl {...props} value={value} onChange={handleChange} />;
}

const NOTE_KIND_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Highlights', value: 'highlight' },
  { label: 'Notes', value: 'note' },
  { label: 'Imports', value: 'imported' },
];

const meta: Meta<TStoryProps> = {
  component: SegmentedControl,
  title: 'Core/SegmentedControl',
  tags: ['autodocs'],
  render: ControlledSegmentedControl,
  args: { options: NOTE_KIND_OPTIONS, value: 'imported', size: 'medium' },
};

export default meta;

type Story = StoryObj<TStoryProps>;

export const Medium: Story = {};
export const Small: Story = {
  args: {
    size: 'small',
    value: 'system',
    options: [
      { label: 'System', value: 'system' },
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
    ],
  },
};
export const Block: Story = {
  args: {
    block: true,
    value: 'notes',
    options: [
      { label: 'Notes', value: 'notes' },
      { label: 'Sources', value: 'sources' },
      { label: 'Automations', value: 'automations' },
    ],
  },
};
export const WithDisabledOption: Story = {
  args: {
    options: [
      ...NOTE_KIND_OPTIONS.slice(0, 3),
      { label: 'Imports', value: 'imported', disabled: true },
    ],
    value: 'all',
  },
};
