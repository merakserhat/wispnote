import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Text from 'components/core/Text';
import { ArrowLeftIcon } from 'components/Icons';
import NotesFeed from 'components/NotesFeed';
import PageHeader from 'components/PageHeader';
import SourceKindDot from 'components/SourceKindDot';

import { formatSourceLocation, formatSourceMeta } from '../Sources.helpers';
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
        <SourceKindDot kind={source.kind} />
        <Text variant="bodySub" color="textSecondary">
          {formatSourceMeta(source)}
        </Text>
      </Box>
      <NotesFeed source={source} />
    </Box>
  );
}

export default SourceDetail;
