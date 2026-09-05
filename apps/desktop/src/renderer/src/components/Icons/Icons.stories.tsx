import type { Meta, StoryObj } from '@storybook/react';

import Box from 'components/core/Box';
import Text from 'components/core/Text';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  File05Icon,
  FolderIcon,
  Logout01Icon,
  SearchSmIcon,
  Settings01Icon,
  Trash01Icon,
  WispLogoIcon,
  XCloseIcon,
  ZapIcon,
} from '.';
import { TIconComponent, TIconProps } from './Icon.types';

const ICONS: Array<[string, TIconComponent]> = [
  ['ArrowLeftIcon', ArrowLeftIcon],
  ['ArrowRightIcon', ArrowRightIcon],
  ['CheckIcon', CheckIcon],
  ['File05Icon', File05Icon],
  ['FolderIcon', FolderIcon],
  ['Logout01Icon', Logout01Icon],
  ['SearchSmIcon', SearchSmIcon],
  ['Settings01Icon', Settings01Icon],
  ['Trash01Icon', Trash01Icon],
  ['WispLogoIcon', WispLogoIcon],
  ['XCloseIcon', XCloseIcon],
  ['ZapIcon', ZapIcon],
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
