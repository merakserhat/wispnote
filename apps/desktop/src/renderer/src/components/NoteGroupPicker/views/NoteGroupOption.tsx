import Box from 'components/core/Box';
import Text from 'components/core/Text';
import { LayersTwo01Icon } from 'components/Icons';

import { NOTE_GROUP_PICKER_ICON_SIZE } from '../NoteGroupPicker.constants';
import { OptionButton } from '../NoteGroupPicker.styles';
import { TNoteGroupOptionProps } from '../NoteGroupPicker.types';

function NoteGroupOption({ group, disabled, onSelect }: TNoteGroupOptionProps) {
  function handlePress() {
    onSelect(group);
  }

  return (
    <OptionButton type="button" disabled={disabled} onClick={handlePress}>
      <LayersTwo01Icon
        width={NOTE_GROUP_PICKER_ICON_SIZE}
        height={NOTE_GROUP_PICKER_ICON_SIZE}
        iconColor="textTertiary"
      />
      <Box flex={1} minWidth={0}>
        <Text variant="bodySub" numberOfLines={1}>
          {group.title}
        </Text>
      </Box>
      <Text variant="caption" color="textTertiary">
        {group.noteCount}
      </Text>
    </OptionButton>
  );
}

export default NoteGroupOption;
