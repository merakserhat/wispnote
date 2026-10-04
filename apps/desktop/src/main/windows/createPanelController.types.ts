import { TRawCaptureContext } from 'shared/types/capture.types';
import { TTriggerFrame } from 'shared/types/engine.types';

export type TShowPanelFrame = Pick<TTriggerFrame, 'action' | 'context' | 'can_sync'>;

export type TPanelController = {
  show: (frame: TShowPanelFrame) => void;
  getContext: () => TRawCaptureContext | null;
};
