import Box from 'components/core/Box';
import PageHeader from 'components/PageHeader';

import { SOURCE_KIND_ORDER, SOURCES_PAGE_DESCRIPTION } from './Sources.constants';
import { useSelectedSource } from './Sources.hooks';
import { SourcesGrid } from './Sources.styles';
import SourceDetail from './views/SourceDetail';
import SourceKindGroup from './views/SourceKindGroup';

function Sources() {
  const { selectedSource, selectSource, clearSelectedSource } = useSelectedSource();

  if (selectedSource) {
    return <SourceDetail source={selectedSource} onBack={clearSelectedSource} />;
  }

  return (
    <Box gap="l">
      <PageHeader title="Sources" description={SOURCES_PAGE_DESCRIPTION} />
      <SourcesGrid>
        {SOURCE_KIND_ORDER.map((kind) => (
          <SourceKindGroup key={kind} kind={kind} onSelectSource={selectSource} />
        ))}
      </SourcesGrid>
    </Box>
  );
}

export default Sources;
