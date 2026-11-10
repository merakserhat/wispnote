import SourceKind from 'shared/enums/SourceKind';
import { TSourceKind } from 'shared/types/capture.types';
import { TCaptureHudResult } from 'shared/types/captureHud.types';
import { TEngineAction } from 'shared/types/engine.types';

// INFO: (serhat) a single tap fires at once and a double tap arrives 250ms later as a supersede.
// Only actions that merely showed something can be taken back; a save already happened.
export const REVERSIBLE_ACTIONS: TEngineAction[] = ['none', 'show_panel', 'quick_note'];

// INFO: (serhat) a 600-page book can take a while to read; the default request timeout is too short.
export const PDF_REQUEST_TIMEOUT_MS = 60000;

export const SOURCE_KIND_BY_CAPTURE: Record<TSourceKind, SourceKind> = {
  web: SourceKind.WEB,
  pdf: SourceKind.PDF,
  file: SourceKind.FILE,
  mail: SourceKind.MAIL,
  app: SourceKind.APP,
};

export const NOTHING_TO_SAVE_RESULT: TCaptureHudResult = {
  icon: 'alert',
  look: 'warning',
  title: 'Nothing to save',
  caption: 'No text selected and no note typed',
};

export const NOT_A_PDF_RESULT: TCaptureHudResult = {
  icon: 'alert',
  look: 'warning',
  title: 'The frontmost window is not a PDF',
  caption: '',
};

export const PDF_UNAVAILABLE_RESULT: TCaptureHudResult = {
  icon: 'alert',
  look: 'warning',
  title: 'PyMuPDF is not installed',
  caption: 'pip install pymupdf, then restart the engine',
};
