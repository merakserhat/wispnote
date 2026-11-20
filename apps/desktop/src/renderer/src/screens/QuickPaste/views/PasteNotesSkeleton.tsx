import Box from 'components/core/Box';

import { TPasteNotesSkeletonProps } from 'screens/QuickPaste';

import { SkeletonBar } from '../QuickPaste.styles';

function PasteNotesSkeleton({ rows }: TPasteNotesSkeletonProps) {
  return (
    <Box gap="m" pt="sm" px="m" pb="sm">
      {Array.from({ length: rows }, (_unused, row) => (
        <Box key={row} gap="s">
          <SkeletonBar width="92%" height={10} borderRadius={5} />
          <SkeletonBar width="64%" height={10} borderRadius={5} />
          <SkeletonBar width={120} height={8} borderRadius={4} />
        </Box>
      ))}
    </Box>
  );
}

export default PasteNotesSkeleton;
