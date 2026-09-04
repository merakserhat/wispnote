import { TCaptureContext } from 'shared/types/capture.types';
import { TPdfAnnotation, TPdfLocateResult } from 'shared/types/engine.types';
import { TActionRequest } from 'shared/types/ipc.types';

import { Engine } from '../engine';
import { HudWindow, MainWindow, PanelWindow } from '../windows';
import { TPanelController } from '../windows/createPanelController.types';

export type TCreateActionsParams = {
  engine: Engine;
  hud: HudWindow;
  panel: PanelWindow;
  controller: TPanelController;
  mainWindow: MainWindow;
};

export type TActionResult = {
  accepted: boolean;
  reason?: string;
};

export type TActions = {
  runAction: (request: TActionRequest) => Promise<TActionResult>;
};

export type TSaveCaptureParams = {
  context: TCaptureContext;
  userNote: string;
};

export type TToCreateNoteParamsParams = {
  context: TCaptureContext;
  userNote: string;
  located: TPdfLocateResult | null;
};

export type TToImportedNoteParamsParams = {
  context: TCaptureContext;
  annotation: TPdfAnnotation;
};
