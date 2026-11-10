import { TCaptureContext } from 'shared/types/capture.types';
import { TCaptureHudIntent } from 'shared/types/captureHud.types';
import { TPdfAnnotation, TPdfLocateResult } from 'shared/types/engine.types';

import { Engine } from '../engine';
import { TCaptureHud } from '../hud';
import { MainWindow } from '../windows';

export type TCreateActionsParams = {
  engine: Engine;
  hud: TCaptureHud;
  mainWindow: MainWindow;
};

export type TActions = {
  runIntent: (intent: TCaptureHudIntent) => Promise<void>;
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
