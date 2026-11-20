import Box from 'components/core/Box';
import Text from 'components/core/Text';
import SourceKindDot from 'components/SourceKindDot';

import { TPasteNoteRowProps } from 'screens/QuickPaste';

import { SOURCE_DOT_SIZE } from '../QuickPaste.constants';
import { NoteRow } from '../QuickPaste.styles';

function PasteNoteRow({ note, index, focused, onHover, onPress }: TPasteNoteRowProps) {
  function handleMove() {
    onHover(index);
  }

  function handlePress() {
    onPress(index);
  }

  return (
    <NoteRow
      type="button"
      tabIndex={-1}
      data-focused={focused}
      $tone={focused ? 'focused' : 'idle'}
      onMouseMove={handleMove}
      onClick={handlePress}>
      <Text as="span" variant="bodySub" numberOfLines={2}>
        {note.text}
      </Text>
      <Box flexDirection="row" alignItems="center" gap="xs" height={18}>
        <SourceKindDot kind={note.sourceKind} size={SOURCE_DOT_SIZE} />
        {note.typed && (
          <Text as="span" variant="label" color="textSecondary" nowrap>
            Note
          </Text>
        )}
        <Box flex={1}>
          <Text as="span" variant="caption" color="textSecondary" numberOfLines={1}>
            {note.caption}
          </Text>
        </Box>
      </Box>
    </NoteRow>
  );
}

export default PasteNoteRow;
