import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Text from 'components/core/Text';
import { AlertTriangleIcon } from 'components/Icons';

import { TPasteErrorProps } from 'screens/QuickPaste';

function PasteError({ onRetry }: TPasteErrorProps) {
  return (
    <Box alignItems="flex-start" gap="s" p="sm">
      <Box flexDirection="row" alignItems="center" gap="s">
        <Box
          flexShrink={0}
          alignItems="center"
          justifyContent="center"
          width={24}
          height={24}
          borderRadius={12}
          backgroundColor="statusWarningGhost">
          <AlertTriangleIcon width={13} height={13} iconColor="statusWarningPrimary" />
        </Box>
        <Text variant="bodySubBold">Can’t load your notes</Text>
      </Box>
      <Text variant="caption" color="textSecondary">
        WispNote couldn’t reach the server and has nothing saved on this Mac yet.
      </Text>
      <Button label="Try again" variant="secondary" size="small" onPress={onRetry} />
    </Box>
  );
}

export default PasteError;
