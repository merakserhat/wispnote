import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TNoteGroupProps } from '../NotesFeed.types';
import NoteRow from './NoteRow';

function NoteGroup({ group, sourceMap, openNoteId, onToggleNote }: TNoteGroupProps) {
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
            isOpen={openNoteId === note.id}
            onToggle={onToggleNote}
          />
        ))}
      </Box>
    </Box>
  );
}

export default NoteGroup;
