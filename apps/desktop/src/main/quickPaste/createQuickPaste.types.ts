import { TCaretRect } from 'shared/types/capture.types';
import { TQuickPasteIntent } from 'shared/types/quickPaste.types';
import { TSource } from 'shared/types/source.types';

import { Engine } from '../engine';
import { TCaptureHud } from '../hud';
import { QuickPasteWindow } from '../windows';

export type TCreateQuickPasteParams = {
  engine: Engine;
  hud: TCaptureHud;
  window: QuickPasteWindow;
};

export type TQuickPaste = {
  open: (caret: TCaretRect | null) => void;
  close: (reason: string) => void;
  isOpen: () => boolean;
  handleIntent: (intent: TQuickPasteIntent) => void;
};

export type TSourceMap = Record<string, TSource>;
