import { TCaptureContext } from './capture.types';

export type TCaptureHudPhase = 'hidden' | 'basic' | 'detailed' | 'result';

export type TCaptureHudIcon = 'check' | 'alert' | 'spin';

export type TCaptureHudLook = 'positive' | 'warning' | 'neutral';

export type TCaptureHudResult = {
  icon: TCaptureHudIcon;
  look: TCaptureHudLook;
  title: string;
  caption: string;
};

export type TCaptureHudCapture = {
  context: TCaptureContext;
  canSync: boolean;
};

export type TCaptureHudState = {
  phase: TCaptureHudPhase;
  captureId: number;
  capture: TCaptureHudCapture | null;
  result: TCaptureHudResult | null;
};

export type TCaptureHudIntent =
  | { type: 'save'; note: string }
  | { type: 'sync' }
  | { type: 'openNotes' }
  | { type: 'typed'; typed: boolean }
  | { type: 'pointer'; inside: boolean };
