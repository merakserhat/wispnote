import { FormEvent } from 'react';

import Box from 'components/core/Box';
import Input from 'components/core/Input';
import Text from 'components/core/Text';

import {
  NOTE_GROUP_PICKER_EMPTY,
  NOTE_GROUP_PICKER_PLACEHOLDER,
} from '../NoteGroupPicker.constants';
import { formatNoMatch } from '../NoteGroupPicker.helpers';
import { useNoteGroupPicker } from '../NoteGroupPicker.hooks';
import { OptionList } from '../NoteGroupPicker.styles';
import { TNoteGroupPickerContentProps } from '../NoteGroupPicker.types';
import CreateNoteGroupOption from './CreateNoteGroupOption';
import NoteGroupOption from './NoteGroupOption';

function NoteGroupPickerContent({ noteId, onDone }: TNoteGroupPickerContentProps) {
  const {
    search,
    setSearch,
    title,
    options,
    isPending,
    isError,
    canCreate,
    isSaving,
    error,
    selectGroup,
    createAndAdd,
    submit,
  } = useNoteGroupPicker({ noteId, onDone });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  const emptyMessage = search.trim() ? formatNoMatch(search) : NOTE_GROUP_PICKER_EMPTY;

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Box p="s" borderBottom="1px solid" borderColor="borderDivider">
          <Input
            name="note-group-search"
            value={search}
            onChangeText={setSearch}
            placeholder={NOTE_GROUP_PICKER_PLACEHOLDER}
            size="small"
            autoFocus
          />
        </Box>
      </form>
      {isError && (
        <Box py="m" px="sm" alignItems="center">
          <Text variant="bodySub" color="statusErrorPrimary">
            Groups could not be loaded.
          </Text>
        </Box>
      )}
      {!isPending && !isError && (
        <OptionList>
          {options.map((group) => (
            <NoteGroupOption
              key={group.id}
              group={group}
              disabled={isSaving}
              onSelect={selectGroup}
            />
          ))}
          {!options.length && (
            <Box py="m" px="sm" alignItems="center">
              <Text variant="bodySub" color="textTertiary" textAlign="center">
                {emptyMessage}
              </Text>
            </Box>
          )}
        </OptionList>
      )}
      {canCreate && (
        <Box p="xs" borderTop="1px solid" borderColor="borderDivider">
          <CreateNoteGroupOption title={title} disabled={isSaving} onCreate={createAndAdd} />
        </Box>
      )}
      {error && (
        <Box px="sm" pb="s">
          <Text variant="caption" color="statusErrorPrimary">
            {error.errorMessage}
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default NoteGroupPickerContent;
