import Text from 'components/core/Text';

import { formatLocation, formatOrigin } from '../Panel.helpers';
import { Header, KindBadge } from '../Panel.styles';
import { TCaptureHeaderProps } from '../Panel.types';

function CaptureHeader({ context }: TCaptureHeaderProps) {
  const meta = [formatLocation(context), formatOrigin(context)].filter(Boolean).join('  ');

  return (
    <>
      <Header>
        <Text variant="title" truncate>
          {context.sourceTitle || context.appName || 'Unknown source'}
        </Text>
        <KindBadge>{context.sourceKind}</KindBadge>
      </Header>

      {Boolean(meta) && (
        <Text variant="meta" muted truncate>
          {meta}
        </Text>
      )}
    </>
  );
}

export default CaptureHeader;
