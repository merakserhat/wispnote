import SourceKind from 'shared/enums/SourceKind';
import { TSourceKind } from 'shared/types/capture.types';
import { TToastPayload } from 'shared/types/ipc.types';

// INFO: (serhat) a 600-page book can take a while to read; the default request timeout is too short.
export const PDF_REQUEST_TIMEOUT_MS = 60000;

export const SOURCE_KIND_BY_CAPTURE: Record<TSourceKind, SourceKind> = {
  web: SourceKind.WEB,
  pdf: SourceKind.PDF,
  file: SourceKind.FILE,
  mail: SourceKind.MAIL,
  app: SourceKind.APP,
};

export const NOTHING_TO_SAVE_TOAST: TToastPayload = {
  message: 'Nothing to save',
  detail: 'No text selected and no note typed',
};

export const NOT_A_PDF_TOAST: TToastPayload = {
  message: 'The frontmost window is not a PDF',
  detail: '',
};

export const PDF_UNAVAILABLE_TOAST: TToastPayload = {
  message: 'PyMuPDF is not installed',
  detail: 'pip install pymupdf, then restart the engine',
};
