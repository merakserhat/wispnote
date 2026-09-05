import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { groupNotesByDay } from '../NotesFeed.helpers';
import { TNotesTimelineProps } from '../NotesFeed.types';
import NoteGroup from './NoteGroup';

function NotesTimeline({
  notes,
  sourceMap,
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
    return (
      <Box py="xxl" alignItems="center" gap="s">
        <Text variant="body" color="textSecondary">
          Nothing here yet.
        </Text>
        <Text variant="bodySub" color="textTertiary">
          Select text anywhere and press Fn Fn.
        </Text>
      </Box>
    );
  }

  return (
    <>
      {groupNotesByDay(notes).map((group) => (
        <NoteGroup
          key={group.label}
          group={group}
          sourceMap={sourceMap}
          openNoteId={openNoteId}
          onToggleNote={onToggleNote}
        />
      ))}
    </>
  );
}

export default NotesTimeline;
