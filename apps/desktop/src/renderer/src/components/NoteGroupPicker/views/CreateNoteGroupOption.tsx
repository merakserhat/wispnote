import Box from 'components/core/Box';
import Text from 'components/core/Text';
import { PlusIcon } from 'components/Icons';

import { NOTE_GROUP_PICKER_ICON_SIZE } from '../NoteGroupPicker.constants';
import { OptionButton } from '../NoteGroupPicker.styles';
import { TCreateNoteGroupOptionProps } from '../NoteGroupPicker.types';

function CreateNoteGroupOption({ title, disabled, onCreate }: TCreateNoteGroupOptionProps) {
  return (
    <OptionButton type="button" disabled={disabled} onClick={onCreate}>
      <PlusIcon
        width={NOTE_GROUP_PICKER_ICON_SIZE}
        height={NOTE_GROUP_PICKER_ICON_SIZE}
        iconColor="textLink"
      />
      <Box flexDirection="row" alignItems="baseline" gap="xs" minWidth={0}>
        <Text as="span" variant="bodySub" color="textLink">
          Create
        </Text>
        <Text as="span" variant="bodySubBold" numberOfLines={1}>
          {title}
        </Text>
      </Box>
    </OptionButton>
  );
}

export default CreateNoteGroupOption;
