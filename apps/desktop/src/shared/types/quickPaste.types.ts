import SourceKind from '../enums/SourceKind';

import { TCaretRect } from './capture.types';

export type TQuickPasteFrame = {
  width: number;
  height: number;
};

export type TQuickPastePlacement = {
  anchor: TCaretRect;
  frame: TQuickPasteFrame;
};

export type TQuickPasteLoad = 'loading' | 'ready' | 'error';

export type TQuickPasteGroup = {
  key: string;
  title: string;
  noteCount: number;
  recent: boolean;
};

export type TQuickPasteNote = {
  id: string;
  text: string;
  typed: boolean;
  sourceKind: SourceKind;
  caption: string;
};

export type TQuickPasteNotes = {
  load: TQuickPasteLoad;
  items: TQuickPasteNote[];
  hasMore: boolean;
};

export type TQuickPasteState = {
  open: boolean;
  openId: number;
  anchor: TCaretRect;
  frame: TQuickPasteFrame;
  load: TQuickPasteLoad;
  groups: TQuickPasteGroup[];
  notes: Record<string, TQuickPasteNotes>;
};

export type TQuickPasteIntent =
  | { type: 'focusGroup'; groupKey: string }
  | { type: 'loadMore'; groupKey: string }
  | { type: 'paste'; groupKey: string; noteId: string }
  | { type: 'pointer'; inside: boolean }
  | { type: 'retry' }
  | { type: 'close' };
