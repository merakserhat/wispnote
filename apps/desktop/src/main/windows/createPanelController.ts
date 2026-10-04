import { TRawCaptureContext } from 'shared/types/capture.types';

import { toCaptureContext } from '../helpers';

import { PanelWindow } from './panelWindow';
import { TPanelController, TShowPanelFrame } from './createPanelController.types';

export function createPanelController(panel: PanelWindow): TPanelController {
  let context: TRawCaptureContext | null = null;

  function show(frame: TShowPanelFrame): void {
    context = frame.context;
    panel.show({
      mode: frame.action === 'quick_note' ? 'note' : 'panel',
      action: frame.action,
      context: toCaptureContext(frame.context),
      canSync: frame.can_sync,
    });
  }

  function getContext(): TRawCaptureContext | null {
    return context;
  }

  return { show, getContext };
}
