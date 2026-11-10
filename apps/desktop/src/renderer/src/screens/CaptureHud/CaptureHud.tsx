import Box from 'components/core/Box';
import { File05Icon, RefreshCw01Icon } from 'components/Icons';

import { SHAPE_TOP, SLOT_ANGLE, WINDOW_HEIGHT, WINDOW_WIDTH } from './CaptureHud.constants';
import {
  getCardMotion,
  getOrbitMotion,
  getPillMotion,
  getSatelliteMotion,
  getShapeMotion,
  getSourceMotion,
} from './CaptureHud.helpers';
import { useCaptureHudHooks } from './CaptureHud.hooks';
import { Motion, Shape } from './CaptureHud.styles';
import HudCard from './views/HudCard';
import HudOrbit from './views/HudOrbit';
import HudPill from './views/HudPill';
import HudSatellite from './views/HudSatellite';

function CaptureHud() {
  const { view, draft, growth, noteRef, onNoteChange, onNoteKeyDown, onSync, onOpenNotes } =
    useCaptureHudHooks();

  const { state, prev, pill, sourceOpen } = view;
  const { phase, capture } = state;
  const detailed = phase === 'detailed';
  const canSync = Boolean(capture?.canSync);

  const shape = getShapeMotion(phase, prev, growth);

  return (
    <Box position="relative" width={WINDOW_WIDTH} height={WINDOW_HEIGHT}>
      <Motion
        position="absolute"
        left={0}
        top={0}
        width={WINDOW_WIDTH}
        height={0}
        $transform={`translateY(${growth}px)`}
        $transition="transform 220ms cubic-bezier(.22,1,.36,1)"
        $pointerEvents="none">
        <HudOrbit motion={getOrbitMotion(detailed)} />
        <HudSatellite
          motion={getSatelliteMotion(detailed && canSync, SLOT_ANGLE, 0)}
          icon={RefreshCw01Icon}
          label="Sync PDF"
          keyLabel="⌃1"
          onPress={onSync}
        />
        <HudSatellite
          motion={getSatelliteMotion(detailed, canSync ? -SLOT_ANGLE : 0, canSync ? 1 : 0)}
          icon={File05Icon}
          label="Open notes"
          keyLabel={canSync ? '⌃2' : '⌃1'}
          onPress={onOpenNotes}
        />
      </Motion>
      <Shape
        data-hud-hit
        position="absolute"
        zIndex={2}
        top={SHAPE_TOP}
        left={shape.left}
        width={shape.width}
        height={shape.height}
        borderRadius={shape.radius}
        borderWidth={1}
        borderColor="borderDivider"
        backgroundColor="backgroundElevated"
        opacity={shape.opacity}
        $transition={shape.transition}
        $pointerEvents={shape.pointerEvents}>
        <HudCard
          capture={capture}
          motion={getCardMotion(phase, prev)}
          source={getSourceMotion(sourceOpen, detailed)}
          draft={draft}
          growth={growth}
          noteRef={noteRef}
          onNoteChange={onNoteChange}
          onNoteKeyDown={onNoteKeyDown}
        />
        <HudPill pill={pill} motion={getPillMotion(phase, prev, pill)} />
      </Shape>
    </Box>
  );
}

export default CaptureHud;
