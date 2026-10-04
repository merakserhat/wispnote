import Box from 'components/core/Box';
import Card from 'components/core/Card';
import Text from 'components/core/Text';
import { LayersTwo01Icon } from 'components/Icons';

import { NOTE_GROUP_CARD_ICON_SIZE, NOTE_GROUP_CARD_MIN_HEIGHT } from '../NoteGroups.constants';
import { formatNoteGroupMeta } from '../NoteGroups.helpers';
import { TNoteGroupCardProps } from '../NoteGroups.types';

function NoteGroupCard({ group, onPress }: TNoteGroupCardProps) {
  function handlePress() {
    onPress(group);
  }

  return (
    <Card
      variant="outlined"
      p="m"
      gap="s"
      minHeight={NOTE_GROUP_CARD_MIN_HEIGHT}
      onPress={handlePress}>
      <Box flexDirection="row" alignItems="center" gap="s">
        <LayersTwo01Icon
          width={NOTE_GROUP_CARD_ICON_SIZE}
          height={NOTE_GROUP_CARD_ICON_SIZE}
          iconColor="textTertiary"
        />
        <Text variant="subtitle" numberOfLines={1}>
          {group.title}
        </Text>
      </Box>
      <Box flex={1}>
        <Text
          variant="bodySub"
          color={group.description ? 'textSecondary' : 'textTertiary'}
          numberOfLines={2}>
          {group.description ?? 'No description'}
        </Text>
      </Box>
      <Text variant="bodySub" color="textSecondary">
        {formatNoteGroupMeta(group.noteCount)}
      </Text>
    </Card>
  );
}

export default NoteGroupCard;
