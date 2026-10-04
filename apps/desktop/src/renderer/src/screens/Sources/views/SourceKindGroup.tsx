import Text from 'components/core/Text';

import { useGetSources } from 'api/sources';

import {
  SOURCE_GROUP_FIRST_PAGE,
  SOURCE_GROUP_PAGE_SIZE,
  SOURCE_GROUP_SORT,
} from '../Sources.constants';
import { getLabelBySourceKind } from '../Sources.helpers';
import { GroupHeader } from '../Sources.styles';
import { TSourceKindGroupProps } from '../Sources.types';
import SourceCard from './SourceCard';

function SourceKindGroup({ kind, onSelectSource }: TSourceKindGroupProps) {
  const { data } = useGetSources({
    options: {
      kind,
      page: SOURCE_GROUP_FIRST_PAGE,
      size: SOURCE_GROUP_PAGE_SIZE,
      ...SOURCE_GROUP_SORT,
    },
  });

  if (!data?.content.length) {
    return <></>;
  }

  return (
    <>
      <GroupHeader>
        <Text variant="label" color="textTertiary">
          {getLabelBySourceKind(kind)}
        </Text>
        <Text variant="label" color="textTertiary">
          {data.totalElements}
        </Text>
      </GroupHeader>
      {data.content.map((source) => (
        <SourceCard key={source.id} source={source} onPress={onSelectSource} />
      ))}
    </>
  );
}

export default SourceKindGroup;
