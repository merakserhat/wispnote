import { TRawCaptureContext } from 'shared/types/capture.types';
import { TTriggerFrame } from 'shared/types/engine.types';

/**
 * The slice of a trigger the panel needs. The tray's "Show panel" builds one by
 * hand from a `capture` reply, so this is deliberately narrower than a trigger.
 */
export type TShowPanelFrame = Pick<TTriggerFrame, 'action' | 'context' | 'can_sync' | 'summary'>;

export type TPanelController = {
  show: (frame: TShowPanelFrame) => void;
  /** The raw capture the panel is currently rendered from, or null if hidden. */
  getContext: () => TRawCaptureContext | null;
};
