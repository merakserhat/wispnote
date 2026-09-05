import Box from 'components/core/Box';
import Card from 'components/core/Card';
import Text from 'components/core/Text';
import SourceKindDot from 'components/SourceKindDot';

import { formatRelativeTime } from 'helpers/date';

import { SOURCE_CARD_MIN_HEIGHT } from '../Sources.constants';
import { formatSourceMeta, formatSourceOrigin } from '../Sources.helpers';
import { TSourceCardProps } from '../Sources.types';

function SourceCard({ source, onPress }: TSourceCardProps) {
  function handlePress() {
    onPress(source);
  }

  return (
    <Card variant="outlined" p="m" gap="s" minHeight={SOURCE_CARD_MIN_HEIGHT} onPress={handlePress}>
      <Box flexDirection="row" alignItems="center" gap="s">
        <SourceKindDot kind={source.kind} />
        <Text variant="mono" color="textTertiary" numberOfLines={1}>
          {formatSourceOrigin(source)}
        </Text>
      </Box>
      <Box flex={1}>
        <Text variant="subtitle" numberOfLines={2}>
          {source.title}
        </Text>
      </Box>
      <Box flexDirection="row" alignItems="baseline" justifyContent="space-between" gap="s">
        <Text variant="bodySub" color="textSecondary">
          {formatSourceMeta(source)}
        </Text>
        <Text variant="caption" color="textTertiary">
          {formatRelativeTime(source.lastActivityAt)}
        </Text>
      </Box>
    </Card>
  );
}

export default SourceCard;
