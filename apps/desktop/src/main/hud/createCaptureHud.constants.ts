import { TCaptureHudState } from 'shared/types/captureHud.types';

export const HIDDEN_STATE: TCaptureHudState = {
  phase: 'hidden',
  captureId: 0,
  capture: null,
  result: null,
};

// INFO: (serhat) timings from the Hud-Machine table: the morph into the pill, then the 1.6s hold.
export const RESULT_HOLD_MS = 1600;
export const RESULT_MORPH_MS = 480;
export const RESULT_SWAP_MS = 300;

// INFO: (serhat) a tap fires at once and its double tap can follow within the engine's 250ms window.
// The card takes the keyboard only after that window: giving the keyboard back (blur) makes macOS
// fade the whole window out for ~270ms, which would hide the morph into the Result pill.
export const KEYBOARD_DELAY_MS = 280;

// INFO: (serhat) the shape needs this long to shrink into the seed before the window goes.
export const HIDE_MORPH_MS = 300;
