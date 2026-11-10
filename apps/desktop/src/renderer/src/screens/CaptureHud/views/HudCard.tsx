import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { CARD_HEIGHT, CARD_WIDTH, SELECTION_HEIGHT } from '../CaptureHud.constants';
import { Motion, NoteArea } from '../CaptureHud.styles';
import { THudCardProps } from '../CaptureHud.types';
import HudSourceRow from './HudSourceRow';

function HudCard({
  capture,
  motion,
  source,
  draft,
  growth,
  noteRef,
  onNoteChange,
  onNoteKeyDown,
}: THudCardProps) {
  const selection = capture?.context.selectedText.trim() ?? '';

  return (
    <Motion
      position="absolute"
      top={0}
      left="50%"
      width={CARD_WIDTH}
      height={CARD_HEIGHT + growth}
      p="sm"
      opacity={motion.opacity}
      $visibility={motion.visibility}
      $transform={motion.transform}
      $transition={motion.transition}>
      <Box
        height={SELECTION_HEIGHT}
        flexShrink={0}
        py="s"
        px="sm"
        borderRadius={10}
        backgroundColor="backgroundSecondary"
        overflow="hidden">
        <Text
          variant="bodySub"
          color={selection ? 'textSecondary' : 'textTertiary'}
          numberOfLines={2}>
          {selection || 'No text selected'}
        </Text>
      </Box>
      <NoteArea
        ref={noteRef}
        aria-label="Note"
        placeholder="Add a note…"
        rows={2}
        spellCheck={false}
        value={draft}
        onChange={onNoteChange}
        onKeyDown={onNoteKeyDown}
      />
      <HudSourceRow capture={capture} motion={source} />
    </Motion>
  );
}

export default HudCard;
