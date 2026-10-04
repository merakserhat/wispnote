import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { PAGE_HEADER_DRAG_STYLE } from './PageHeader.constants';
import { TPageHeaderProps } from './PageHeader.types';

function PageHeader({ title, description }: TPageHeaderProps) {
  return (
    <Box gap="xs" style={PAGE_HEADER_DRAG_STYLE}>
      <Text as="h1" variant="heading">
        {title}
      </Text>
      {description && (
        <Text variant="body" color="textSecondary">
          {description}
        </Text>
      )}
    </Box>
  );
}

export default PageHeader;
