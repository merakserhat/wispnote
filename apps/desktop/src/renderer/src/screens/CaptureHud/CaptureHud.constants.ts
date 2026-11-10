import { TCaptureHudLook, TCaptureHudPhase } from 'shared/types/captureHud.types';

import { TCaptureHudView, TGeometry, TLookColors, TPillContent } from './CaptureHud.types';

export const EASE = {
  spring: 'cubic-bezier(.34,1.36,.64,1)',
  out: 'cubic-bezier(.22,1,.36,1)',
  in: 'cubic-bezier(.5,0,.75,0)',
};

export const GEOMETRY: Record<TCaptureHudPhase, TGeometry> = {
  hidden: { width: 12, height: 12, radius: 6 },
  basic: { width: 380, height: 140, radius: 20 },
  detailed: { width: 380, height: 184, radius: 20 },
  result: { width: 320, height: 52, radius: 26 },
};

export const WINDOW_WIDTH = 440;
export const WINDOW_HEIGHT = 412;
export const DESIGN_HEIGHT = 320;
export const SHAPE_TOP = 8;
export const SHAPE_CENTER_X = 220;

export const CARD_WIDTH = 380;
export const CARD_HEIGHT = 184;
export const SELECTION_HEIGHT = 54;
export const SOURCE_ROW_HEIGHT = 44;

export const NOTE_MIN_HEIGHT = 56;
export const NOTE_MAX_HEIGHT = 146;

export const PILL_WIDTH = 320;
export const PILL_HEIGHT = 52;
export const DISC_SIZE = 32;
export const DISC_ICON_SIZE = 16;
export const CHECK_PATH = 'M5 12.5L9.5 17L19 7.5';
export const CHECK_LENGTH = 22;

export const ORBIT_CENTER_Y = 88;
export const ORBIT_RADIUS = 160;
export const ORBIT_PATH = 'M117.2 210.6A160 160 0 0 0 322.8 210.6';
export const SLOT_ANGLE = 24;
export const SATELLITE_SIZE = 44;
export const SATELLITE_ICON_SIZE = 18;

export const HIT_SELECTOR = '[data-hud-hit]';
export const HIT_RECHECK_MS = 350;

export const LOOK_COLORS: Record<TCaptureHudLook, TLookColors> = {
  positive: { background: 'statusPositiveGhost', color: 'statusPositivePrimary' },
  warning: { background: 'statusWarningGhost', color: 'statusWarningPrimary' },
  neutral: { background: 'backgroundSecondary', color: 'textSecondary' },
};

export const EMPTY_PILL: TPillContent = {
  icon: 'check',
  look: 'positive',
  title: '',
  caption: '',
};

export const INITIAL_VIEW: TCaptureHudView = {
  state: { phase: 'hidden', captureId: 0, capture: null, result: null },
  prev: 'hidden',
  pill: EMPTY_PILL,
  sourceOpen: false,
};
