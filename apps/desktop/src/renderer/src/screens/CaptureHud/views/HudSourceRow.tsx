import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { SOURCE_ROW_HEIGHT } from '../CaptureHud.constants';
import { formatLocation, formatOrigin, formatSource } from '../CaptureHud.helpers';
import { Motion } from '../CaptureHud.styles';
import { THudSourceRowProps } from '../CaptureHud.types';

function HudSourceRow({ capture, motion }: THudSourceRowProps) {
  const context = capture?.context;
  const meta = context ? formatLocation(context) || formatOrigin(context) : '';

  return (
    <Motion
      height={motion.height}
      flexShrink={0}
      overflow="hidden"
      opacity={motion.opacity}
      $transition={motion.transition}>
      <Box
        height={SOURCE_ROW_HEIGHT}
        flexShrink={0}
        mx="sm"
        pt="s"
        borderTop="1px solid"
        borderColor="borderDivider">
        <Box flexDirection="row" alignItems="baseline" gap="xs">
          <Text variant="bodySubBold" numberOfLines={1}>
            {context ? formatSource(context) : ''}
          </Text>
          {Boolean(context) && (
            <Box
              flexShrink={0}
              px="xs"
              borderWidth={1}
              borderStyle="solid"
              borderColor="textTertiary"
              borderRadius={4}>
              <Text variant="label" color="textTertiary" nowrap>
                {context?.sourceKind}
              </Text>
            </Box>
          )}
        </Box>
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          {meta}
        </Text>
      </Box>
    </Motion>
  );
}

export default HudSourceRow;
