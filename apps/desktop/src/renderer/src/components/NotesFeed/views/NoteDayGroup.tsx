import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TNoteDayGroupProps } from '../NotesFeed.types';
import NoteRow from './NoteRow';

function NoteDayGroup({
  group,
  sourceMap,
  noteGroup,
  openNoteId,
  onToggleNote,
}: TNoteDayGroupProps) {
  return (
    <Box gap="sm">
      <Text variant="label" color="textTertiary">
        {group.label}
      </Text>
      <Box borderTop="1px solid" borderColor="borderDivider">
        {group.notes.map((note) => (
          <NoteRow
            key={note.id}
            note={note}
            source={sourceMap[note.sourceId]}
            noteGroup={noteGroup}
            isOpen={openNoteId === note.id}
            onToggle={onToggleNote}
          />
        ))}
      </Box>
    </Box>
  );
}

export default NoteDayGroup;
