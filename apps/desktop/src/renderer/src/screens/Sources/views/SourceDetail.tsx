import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Text from 'components/core/Text';
import { ArrowLeftIcon } from 'components/Icons';
import PageHeader from 'components/PageHeader';

import { formatSourceLocation, formatSourceMeta, getColorBySourceKind } from '../Sources.helpers';
import { KindDot } from '../Sources.styles';
import { TSourceDetailProps } from '../Sources.types';

function SourceDetail({ source, onBack }: TSourceDetailProps) {
  return (
    <Box gap="l">
      <Box alignItems="flex-start">
        <Button
          label="All sources"
          variant="ghost"
          size="small"
          leftIcon={ArrowLeftIcon}
          onPress={onBack}
        />
      </Box>
      <PageHeader title={source.title} description={formatSourceLocation(source)} />
      <Box flexDirection="row" alignItems="center" gap="s">
        <KindDot $color={getColorBySourceKind(source.kind)} />
        <Text variant="bodySub" color="textSecondary">
          {formatSourceMeta(source)}
        </Text>
      </Box>
      <Text variant="body" color="textSecondary">
        The highlights from this source will list here once the Notes screen lands.
      </Text>
    </Box>
  );
}

export default SourceDetail;
