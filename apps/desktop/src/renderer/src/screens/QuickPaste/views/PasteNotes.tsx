import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TPasteNotesProps } from 'screens/QuickPaste';

import { getSkeletonRows } from '../QuickPaste.helpers';
import { List } from '../QuickPaste.styles';

import PasteNoteRow from './PasteNoteRow';
import PasteNotesSkeleton from './PasteNotesSkeleton';

function PasteNotes({
  group,
  notes,
  focus,
  listMaxHeight,
  listRef,
  onScroll,
  onHover,
  onPress,
}: TPasteNotesProps) {
  const items = notes?.items ?? [];
  const loading = items.length === 0 && (!notes || notes.load === 'loading');
  const failed = items.length === 0 && notes?.load === 'error';
  const empty = items.length === 0 && notes?.load === 'ready';

  return (
    <>
      {loading && <PasteNotesSkeleton rows={getSkeletonRows(group)} />}

      {failed && (
        <Box gap="xs" pt="sm" px="m" pb="m">
          <Text variant="bodySubBold">Couldn’t load these notes</Text>
          <Text variant="caption" color="textSecondary">
            WispNote couldn’t reach the server. Move to another group and back to try again.
          </Text>
        </Box>
      )}

      {empty && (
        <Box gap="xs" pt="sm" px="m" pb="m">
          <Text variant="bodySubBold">No notes in {group.title} yet</Text>
          <Text variant="caption" color="textSecondary">
            Add notes to this group in WispNote and they show up here.
          </Text>
        </Box>
      )}

      {items.length > 0 && (
        <List
          ref={listRef}
          maxHeight={listMaxHeight}
          overflowY="auto"
          gap="xxs"
          p="xs"
          onScroll={onScroll}>
          {items.map((note, index) => (
            <PasteNoteRow
              key={note.id}
              note={note}
              index={index}
              focused={focus.column === 'notes' && index === focus.note}
              onHover={onHover}
              onPress={onPress}
            />
          ))}
          {Boolean(notes?.hasMore) && <PasteNotesSkeleton rows={1} />}
        </List>
      )}
    </>
  );
}

export default PasteNotes;
