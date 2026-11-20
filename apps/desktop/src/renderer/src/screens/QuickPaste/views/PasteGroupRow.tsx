import React from 'react';

import Box from 'components/core/Box';
import Text from 'components/core/Text';
import { ChevronRightIcon, ClockIcon, LayersTwo01Icon } from 'components/Icons';

import { TPasteGroupRowProps } from 'screens/QuickPaste';

import { CHEVRON_SIZE, GROUP_ICON_SIZE } from '../QuickPaste.constants';
import { GroupRow } from '../QuickPaste.styles';

function PasteGroupRow({ group, index, tone, onHover, onPress }: TPasteGroupRowProps) {
  const Icon = group.recent ? ClockIcon : LayersTwo01Icon;

  function handleMove(event: React.MouseEvent<HTMLButtonElement>) {
    onHover(index, { x: event.clientX, y: event.clientY });
  }

  function handlePress() {
    onPress(index);
  }

  return (
    <GroupRow
      type="button"
      tabIndex={-1}
      data-focused={tone !== 'idle'}
      aria-current={tone !== 'idle'}
      $tone={tone}
      onMouseMove={handleMove}
      onClick={handlePress}>
      <Icon width={GROUP_ICON_SIZE} height={GROUP_ICON_SIZE} iconColor="textSecondary" />
      <Box flex={1}>
        <Text as="span" variant={tone === 'idle' ? 'bodySub' : 'bodySubBold'} numberOfLines={1}>
          {group.title}
        </Text>
      </Box>
      {!group.recent && (
        <Text as="span" variant="caption" color="textSecondary" nowrap>
          {group.noteCount}
        </Text>
      )}
      <ChevronRightIcon
        width={CHEVRON_SIZE}
        height={CHEVRON_SIZE}
        strokeWidth={2.4}
        iconColor="textTertiary"
      />
    </GroupRow>
  );
}

export default PasteGroupRow;
