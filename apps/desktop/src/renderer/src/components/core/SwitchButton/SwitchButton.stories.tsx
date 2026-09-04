import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';

import SwitchButton from './SwitchButton';
import { TSwitchButtonProps } from './SwitchButton.types';

function ControlledSwitchButton(props: TSwitchButtonProps) {
  const [{ value }, updateArgs] = useArgs<TSwitchButtonProps>();

  function handleChange(next: boolean) {
    updateArgs({ value: next });
  }

  return <SwitchButton {...props} value={value} onChange={handleChange} />;
}

const meta: Meta<typeof SwitchButton> = {
  component: SwitchButton,
  title: 'Core/SwitchButton',
  tags: ['autodocs'],
  render: ControlledSwitchButton,
  args: { name: 'suppressFn', value: true, label: 'Swallow bare Fn' },
};

export default meta;

type Story = StoryObj<typeof SwitchButton>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: 'Hides the emoji picker' } };
export const Off: Story = { args: { value: false, label: 'Launch at login' } };
export const Small: Story = { args: { size: 'small', label: 'Rule active' } };
export const Disabled: Story = { args: { disabled: true, label: 'Disabled' } };
export const NoLabel: Story = { args: { label: undefined } };
