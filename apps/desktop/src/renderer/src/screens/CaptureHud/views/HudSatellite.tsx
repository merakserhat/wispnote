import Box from 'components/core/Box';
import Keycap from 'components/core/Keycap';
import Text from 'components/core/Text';

import {
  ORBIT_CENTER_Y,
  SATELLITE_ICON_SIZE,
  SATELLITE_SIZE,
  SHAPE_CENTER_X,
} from '../CaptureHud.constants';
import { Motion, SatelliteCard } from '../CaptureHud.styles';
import { THudSatelliteProps } from '../CaptureHud.types';

function HudSatellite({ motion, icon: Icon, label, keyLabel, onPress }: THudSatelliteProps) {
  return (
    <Motion
      position="absolute"
      zIndex={1}
      left={SHAPE_CENTER_X}
      top={ORBIT_CENTER_Y}
      width={0}
      height={0}
      $transform={`rotate(${motion.rotation}deg)`}
      $transition={motion.angleTransition}>
      <Motion
        position="absolute"
        left={-SATELLITE_SIZE / 2}
        top={-SATELLITE_SIZE / 2}
        width={SATELLITE_SIZE}
        height={SATELLITE_SIZE}
        opacity={motion.opacity}
        $visibility={motion.visibility}
        $pointerEvents={motion.pointerEvents}
        $transform={`translateY(${motion.radius}px) scale(${motion.scale})`}
        $transition={motion.radiusTransition}>
        <Motion
          position="absolute"
          left={0}
          top={0}
          width={SATELLITE_SIZE}
          height={SATELLITE_SIZE}
          $transform={`rotate(${-motion.rotation}deg)`}
          $transition={motion.angleTransition}>
          <SatelliteCard
            data-hud-hit
            aria-label={label}
            variant="outlined"
            width={SATELLITE_SIZE}
            height={SATELLITE_SIZE}
            borderRadius={SATELLITE_SIZE / 2}
            onPress={onPress}>
            <Box flex={1} alignItems="center" justifyContent="center">
              <Icon width={SATELLITE_ICON_SIZE} height={SATELLITE_ICON_SIZE} strokeWidth={1.9} />
            </Box>
          </SatelliteCard>
          <Motion
            position="absolute"
            top={SATELLITE_SIZE + 6}
            left={SATELLITE_SIZE / 2}
            flexDirection="row"
            alignItems="center"
            gap="xs"
            $transform="translateX(-50%)">
            <Text variant="caption" color="textSecondary" nowrap>
              {label}
            </Text>
            <Keycap size="small" label={keyLabel} />
          </Motion>
        </Motion>
      </Motion>
    </Motion>
  );
}

export default HudSatellite;
