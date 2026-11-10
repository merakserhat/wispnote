import { useTheme } from 'styled-components';

import { DESIGN_HEIGHT, ORBIT_CENTER_Y, ORBIT_PATH, WINDOW_WIDTH } from '../CaptureHud.constants';
import { Motion } from '../CaptureHud.styles';
import { THudOrbitProps } from '../CaptureHud.types';

function HudOrbit({ motion }: THudOrbitProps) {
  const { colors } = useTheme();

  return (
    <Motion
      position="absolute"
      left={0}
      top={0}
      opacity={motion.opacity}
      $transform={motion.transform}
      $transformOrigin={`${WINDOW_WIDTH / 2}px ${ORBIT_CENTER_Y}px`}
      $transition={motion.transition}>
      <svg
        aria-hidden="true"
        width={WINDOW_WIDTH}
        height={DESIGN_HEIGHT}
        viewBox={`0 0 ${WINDOW_WIDTH} ${DESIGN_HEIGHT}`}
        fill="none">
        <path
          d={ORBIT_PATH}
          stroke={colors.textTertiary}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="0.5 6"
        />
      </svg>
    </Motion>
  );
}

export default HudOrbit;
