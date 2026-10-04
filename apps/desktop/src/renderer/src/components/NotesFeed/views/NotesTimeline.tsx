import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { getNotesEmptyState, groupNotesByDay } from '../NotesFeed.helpers';
import { TNotesTimelineProps } from '../NotesFeed.types';
import NoteDayGroup from './NoteDayGroup';

function NotesTimeline({
  notes,
  sourceMap,
  noteGroup,
  openNoteId,
  isPending,
  isError,
  onToggleNote,
}: TNotesTimelineProps) {
  if (isPending) {
    return <></>;
  }

  if (isError) {
    return (
      <Box py="xxl" alignItems="center">
        <Text variant="body" color="statusErrorPrimary">
          Notes could not be loaded.
        </Text>
      </Box>
    );
  }

  if (!notes.length) {
    const emptyState = getNotesEmptyState(noteGroup);

    return (
      <Box py="xxl" alignItems="center" gap="s">
        <Text variant="body" color="textSecondary">
          {emptyState.title}
        </Text>
        <Text variant="bodySub" color="textTertiary">
          {emptyState.hint}
        </Text>
      </Box>
    );
  }

  return (
    <>
      {groupNotesByDay(notes).map((group) => (
        <NoteDayGroup
          key={group.label}
          group={group}
          sourceMap={sourceMap}
          noteGroup={noteGroup}
          openNoteId={openNoteId}
          onToggleNote={onToggleNote}
        />
      ))}
    </>
  );
}

export default NotesTimeline;
