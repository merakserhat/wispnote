import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Text from 'components/core/Text';

import Popover from './Popover';
import { TPopoverProps } from './Popover.types';

type TStoryProps = Omit<TPopoverProps, 'open' | 'onOpenChange' | 'children'>;

function PopoverWithTrigger(props: TStoryProps) {
  const [open, setOpen] = useState(false);

  function handleToggle() {
    setOpen((current) => !current);
  }

  return (
    <Box alignItems="flex-start" p="xl">
      <Popover {...props} open={open} onOpenChange={setOpen}>
        <Button label="Open popover" variant="secondary" onPress={handleToggle} />
      </Popover>
    </Box>
  );
}

const meta: Meta<TStoryProps> = {
  component: Popover,
  title: 'Core/Popover',
  tags: ['autodocs'],
  render: PopoverWithTrigger,
  args: {
    placement: 'bottomLeft',
    content: (
      <Box p="m" gap="xs">
        <Text variant="bodySubBold">Popover content</Text>
        <Text variant="bodySub" color="textSecondary">
          Anything can go here. The panel has no padding of its own.
        </Text>
      </Box>
    ),
  },
};

export default meta;

type Story = StoryObj<TStoryProps>;

export const Default: Story = {};
export const Narrow: Story = { args: { width: 220 } };
