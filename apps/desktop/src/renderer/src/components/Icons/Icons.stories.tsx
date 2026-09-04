import type { Meta, StoryObj } from '@storybook/react';

import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { ArrowRightIcon, CheckIcon, SearchSmIcon, Trash01Icon, XCloseIcon } from '.';
import { TIconComponent, TIconProps } from './Icon.types';

const ICONS: Array<[string, TIconComponent]> = [
  ['ArrowRightIcon', ArrowRightIcon],
  ['CheckIcon', CheckIcon],
  ['SearchSmIcon', SearchSmIcon],
  ['Trash01Icon', Trash01Icon],
  ['XCloseIcon', XCloseIcon],
];

function IconGallery({ width = 24, height = 24, strokeWidth = 2, iconColor }: TIconProps) {
  return (
    <Box flexDirection="row" flexWrap="wrap" gap="m">
      {ICONS.map(([name, Icon]) => (
        <Box key={name} alignItems="center" gap="xs" width={112}>
          <Icon width={width} height={height} strokeWidth={strokeWidth} iconColor={iconColor} />
          <Text variant="caption" color="textTertiary">
            {name}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

const meta: Meta<typeof IconGallery> = {
  component: IconGallery,
  title: 'Icons/All',
  tags: ['autodocs'],
  args: { width: 24, height: 24, strokeWidth: 2, iconColor: 'textPrimary' },
};

export default meta;

type Story = StoryObj<typeof IconGallery>;

export const All: Story = {};
export const Small: Story = { args: { width: 16, height: 16 } };
export const Tertiary: Story = { args: { iconColor: 'textTertiary' } };
