import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TKeyHintProps } from '../CaptureHud.types';

function KeyHint({ keyLabel, label }: TKeyHintProps) {
  return (
    <Box flexDirection="row" alignItems="center" gap="xs">
      <Box
        height={16}
        px="xs"
        alignItems="center"
        justifyContent="center"
        borderWidth={1}
        borderStyle="solid"
        borderColor="borderOutline"
        borderRadius={4}>
        <Text variant="kbd" color="textSecondary" nowrap>
          {keyLabel}
        </Text>
      </Box>
      {Boolean(label) && (
        <Text variant="caption" color="textSecondary" nowrap>
          {label}
        </Text>
      )}
    </Box>
  );
}

export default KeyHint;
