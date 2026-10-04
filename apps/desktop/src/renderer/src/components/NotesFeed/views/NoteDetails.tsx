import Box from 'components/core/Box';
import Text from 'components/core/Text';
import { getColorBySourceKind } from 'components/SourceKindDot';

import NoteKind from 'shared/enums/NoteKind';

import { NOTE_DETAIL_LABEL_WIDTH } from '../NotesFeed.constants';
import { getNoteDetailEntries } from '../NotesFeed.helpers';
import { Highlight } from '../NotesFeed.styles';
import { TNoteDetailsProps } from '../NotesFeed.types';

function NoteDetails({ note, source }: TNoteDetailsProps) {
  const highlightColor = source ? getColorBySourceKind(source.kind) : 'textTertiary';
  const showUserNote = Boolean(note.userNote) && note.kind !== NoteKind.NOTE;

  return (
    <Box gap="sm" p="m" borderRadius={10} backgroundColor="backgroundSecondary">
      {note.selectedText && (
        <Text variant="bodySub" color="textSecondary">
          {note.contextBefore} <Highlight $color={highlightColor}>{note.selectedText}</Highlight>{' '}
          {note.contextAfter}
        </Text>
      )}
      {showUserNote && (
        <Box pl="sm" borderLeft="2px solid" borderColor="borderOutline">
          <Text variant="bodySub">{note.userNote}</Text>
        </Box>
      )}
      <Box gap="xs">
        {getNoteDetailEntries(note, source).map((entry) => (
          <Box key={entry.label} flexDirection="row" gap="m">
            <Box width={NOTE_DETAIL_LABEL_WIDTH} flexShrink={0}>
              <Text variant="caption" color="textTertiary">
                {entry.label}
              </Text>
            </Box>
            <Text variant={entry.mono ? 'mono' : 'caption'}>{entry.value}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default NoteDetails;
