import Box from 'components/core/Box';
import IconButton from 'components/core/IconButton';
import Text from 'components/core/Text';
import { Trash01Icon } from 'components/Icons';
import SourceKindDot from 'components/SourceKindDot';

import { useDeleteNote } from 'api/notes';
import NoteKind from 'shared/enums/NoteKind';

import { formatClockTime } from 'helpers/date';

import { NOTE_TEXT_COLLAPSED_LINES, NOTE_TIME_COLUMN_WIDTH } from '../NotesFeed.constants';
import { formatNoteLocation } from '../NotesFeed.helpers';
import { NoteToggle } from '../NotesFeed.styles';
import { TNoteRowProps } from '../NotesFeed.types';
import NoteDetails from './NoteDetails';

function NoteRow({ note, source, isOpen, onToggle }: TNoteRowProps) {
  const { deleteNote, isPending: isDeleting } = useDeleteNote();
  const isNote = note.kind === NoteKind.NOTE;
  const location = formatNoteLocation(note);

  function handleToggle() {
    onToggle(note.id);
  }

  function handleDelete() {
    deleteNote({ noteId: note.id });
  }

  return (
    <Box
      flexDirection="row"
      alignItems="flex-start"
      gap="ml"
      py="m"
      borderBottom="1px solid"
      borderColor="borderDivider">
      <Box width={NOTE_TIME_COLUMN_WIDTH} flexShrink={0} pt="xxs">
        <Text variant="bodySub" color="textTertiary">
          {formatClockTime(note.createdAt)}
        </Text>
      </Box>
      <Box flex={1} gap="sm">
        <NoteToggle type="button" onClick={handleToggle}>
          {isNote && (
            <Text as="span" variant="label" color="textTertiary">
              Note
            </Text>
          )}
          <Text
            as="span"
            variant="body"
            color={isNote ? 'textSecondary' : 'textPrimary'}
            numberOfLines={isOpen ? undefined : NOTE_TEXT_COLLAPSED_LINES}>
            {isNote ? note.userNote : note.selectedText}
          </Text>
          <Box flexDirection="row" alignItems="center" flexWrap="wrap" gap="s">
            {source && (
              <>
                <SourceKindDot kind={source.kind} />
                <Text as="span" variant="bodySub" color="textSecondary" numberOfLines={1}>
                  {source.title}
                </Text>
              </>
            )}
            {location && (
              <Text as="span" variant="mono" color="textTertiary">
                {location}
              </Text>
            )}
          </Box>
        </NoteToggle>
        {isOpen && <NoteDetails note={note} source={source} />}
      </Box>
      <IconButton
        icon={Trash01Icon}
        variant="secondary"
        size="small"
        loading={isDeleting}
        onPress={handleDelete}
      />
    </Box>
  );
}

export default NoteRow;
