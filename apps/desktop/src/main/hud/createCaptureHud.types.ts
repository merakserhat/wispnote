import { TRawCaptureContext } from 'shared/types/capture.types';
import {
  TCaptureHudIntent,
  TCaptureHudPhase,
  TCaptureHudResult,
} from 'shared/types/captureHud.types';
import { TTriggerFrame } from 'shared/types/engine.types';

import { Engine } from '../engine';
import { CaptureHudWindow } from '../windows';

export type TCreateCaptureHudParams = {
  engine: Engine;
  window: CaptureHudWindow;
};

export type TOpenHudFrame = Pick<TTriggerFrame, 'context' | 'can_sync'>;

export type TCaptureHud = {
  open: (frame: TOpenHudFrame) => void;
  showResult: (result: TCaptureHudResult) => void;
  reportResult: (result: TCaptureHudResult) => void;
  escape: () => void;
  dismiss: () => void;
  handleIntent: (intent: TCaptureHudIntent) => void;
  getContext: () => TRawCaptureContext | null;
  getPhase: () => TCaptureHudPhase;
  hasNote: () => boolean;
};
