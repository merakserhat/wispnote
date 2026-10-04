import { useState } from 'react';

import IconButton from 'components/core/IconButton';
import Popover from 'components/core/Popover';
import { FolderPlusIcon } from 'components/Icons';

import { NOTE_GROUP_PICKER_WIDTH } from './NoteGroupPicker.constants';
import { TNoteGroupPickerProps } from './NoteGroupPicker.types';
import NoteGroupPickerContent from './views/NoteGroupPickerContent';

function NoteGroupPicker({ noteId }: TNoteGroupPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((current) => !current);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      width={NOTE_GROUP_PICKER_WIDTH}
      content={<NoteGroupPickerContent noteId={noteId} onDone={handleClose} />}>
      <IconButton icon={FolderPlusIcon} variant="secondary" size="small" onPress={handleToggle} />
    </Popover>
  );
}

export default NoteGroupPicker;
