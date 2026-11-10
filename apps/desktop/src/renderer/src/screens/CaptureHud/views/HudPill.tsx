import ActivityIndicator from 'components/core/ActivityIndicator';
import Box from 'components/core/Box';
import Text from 'components/core/Text';
import { AlertTriangleIcon } from 'components/Icons';

import {
  CHECK_PATH,
  DISC_ICON_SIZE,
  DISC_SIZE,
  PILL_HEIGHT,
  PILL_WIDTH,
} from '../CaptureHud.constants';
import { CheckPath, Disc, Motion } from '../CaptureHud.styles';
import { THudPillProps } from '../CaptureHud.types';

const ICON_FADE = 'opacity 120ms linear';
const ICON_INSET = (DISC_SIZE - DISC_ICON_SIZE) / 2;

function HudPill({ pill, motion }: THudPillProps) {
  return (
    <Motion
      position="absolute"
      top={0}
      left="50%"
      width={PILL_WIDTH}
      height={PILL_HEIGHT}
      opacity={motion.opacity}
      $visibility={motion.visibility}
      $transform="translateX(-50%)"
      $transition={motion.transition}>
      <Disc
        aria-hidden="true"
        position="absolute"
        left={9}
        top={9}
        width={DISC_SIZE}
        height={DISC_SIZE}
        borderRadius={DISC_SIZE / 2}
        $look={pill.look}>
        <Box
          position="absolute"
          left={ICON_INSET}
          top={ICON_INSET}
          opacity={pill.icon === 'check' ? 1 : 0}>
          <svg width={DISC_ICON_SIZE} height={DISC_ICON_SIZE} viewBox="0 0 24 24" fill="none">
            <CheckPath
              d={CHECK_PATH}
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              $offset={motion.checkOffset}
              $transition={motion.checkTransition}
            />
          </svg>
        </Box>
        <Motion
          position="absolute"
          left={ICON_INSET}
          top={ICON_INSET}
          opacity={pill.icon === 'alert' ? 1 : 0}
          $transition={ICON_FADE}>
          <AlertTriangleIcon width={DISC_ICON_SIZE} height={DISC_ICON_SIZE} />
        </Motion>
        <Motion
          position="absolute"
          left={ICON_INSET}
          top={ICON_INSET}
          opacity={pill.icon === 'spin' ? 1 : 0}
          $transition={ICON_FADE}>
          <ActivityIndicator size={DISC_ICON_SIZE} />
        </Motion>
      </Disc>

      <Box
        position="absolute"
        left={52}
        right={16}
        top={0}
        height={PILL_HEIGHT - 2}
        justifyContent="center">
        <Text variant="bodySubBold" numberOfLines={1}>
          {pill.title}
        </Text>
        {Boolean(pill.caption) && (
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {pill.caption}
          </Text>
        )}
      </Box>
    </Motion>
  );
}

export default HudPill;
