import Box from 'components/core/Box';

import { GROUP_ROW_HEIGHT, SKELETON_GROUP_WIDTHS } from '../QuickPaste.constants';
import { SkeletonBar } from '../QuickPaste.styles';

function PasteGroupsSkeleton() {
  return (
    <Box gap="xxs" p="xs">
      {SKELETON_GROUP_WIDTHS.map((width) => (
        <Box
          key={width}
          flexDirection="row"
          alignItems="center"
          gap="s"
          height={GROUP_ROW_HEIGHT}
          px="s">
          <SkeletonBar width={15} height={15} borderRadius={4} />
          <SkeletonBar width={width} height={10} borderRadius={5} />
        </Box>
      ))}
    </Box>
  );
}

export default PasteGroupsSkeleton;
