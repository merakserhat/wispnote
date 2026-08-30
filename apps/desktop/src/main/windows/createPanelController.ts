import { TRawCaptureContext } from 'shared/types/capture.types';

import { toCaptureContext } from '../helpers';

import { PanelWindow } from './panelWindow';
import { TPanelController, TShowPanelFrame } from './createPanelController.types';

/**
 * Showing the panel, and remembering what it was shown for.
 *
 * The context lives in this closure rather than in `main.ts` because the IPC
 * layer has to read back the *same* capture the panel was rendered from -
 * re-capturing at action time would describe WispNote instead of the article.
 */
export const createPanelController = (panel: PanelWindow): TPanelController => {
  let context: TRawCaptureContext | null = null;

  const show = (frame: TShowPanelFrame): void => {
    context = frame.context;
    panel.show({
      mode: frame.action === 'quick_note' ? 'note' : 'panel',
      action: frame.action,
      context: toCaptureContext(frame.context),
      canSync: frame.can_sync,
      summary: frame.summary,
    });
  };

  return {
    show,
    getContext: () => context,
  };
};
