import React from 'react';

import {
  TQuickPasteGroup,
  TQuickPasteNote,
  TQuickPasteNotes,
  TQuickPasteState,
} from 'shared/types/quickPaste.types';

export type TPasteColumn = 'groups' | 'notes';

export type TPasteMode = 'nothing' | 'error' | 'first' | 'browse';

export type TPasteRowTone = 'focused' | 'parent' | 'idle';

export type TPasteFocus = {
  group: number;
  column: TPasteColumn;
  note: number;
};

export type TPastePoint = {
  x: number;
  y: number;
};

export type TPasteMeasure = {
  groupsHeight: number;
  rowOffset: number;
  notesHeight: number;
};

export type TPasteLayout = {
  groupsLeft: number;
  groupsTop: number;
  notesLeft: number;
  notesTop: number;
  notesListMaxHeight: number;
};

export type TPasteMotion = {
  opacity: number;
  transition: string;
  visibility: 'visible' | 'hidden';
  pointerEvents: 'auto' | 'none';
};

export type TPastePanelStyleProps = {
  $transition: string;
  $visibility: 'visible' | 'hidden';
  $pointerEvents: 'auto' | 'none';
};

export type TPasteRowStyleProps = {
  $tone: TPasteRowTone;
};

export type TQuickPasteHooksReturn = {
  state: TQuickPasteState;
  mode: TPasteMode;
  focus: TPasteFocus;
  group: TQuickPasteGroup | null;
  notes: TQuickPasteNotes | null;
  layout: TPasteLayout;
  hasOnlyRecent: boolean;
  groupsPanelRef: React.RefObject<HTMLDivElement>;
  notesPanelRef: React.RefObject<HTMLDivElement>;
  groupListRef: React.RefObject<HTMLDivElement>;
  noteListRef: React.RefObject<HTMLDivElement>;
  onGroupsScroll: () => void;
  onNotesScroll: () => void;
  onGroupHover: (index: number, point: TPastePoint) => void;
  onGroupPress: (index: number) => void;
  onNoteHover: (index: number) => void;
  onNotePress: (index: number) => void;
  onRetry: () => void;
};

export type TPasteGroupRowProps = {
  group: TQuickPasteGroup;
  index: number;
  tone: TPasteRowTone;
  onHover: (index: number, point: TPastePoint) => void;
  onPress: (index: number) => void;
};

export type TPasteNoteRowProps = {
  note: TQuickPasteNote;
  index: number;
  focused: boolean;
  onHover: (index: number) => void;
  onPress: (index: number) => void;
};

export type TPasteGroupsProps = {
  mode: TPasteMode;
  groups: TQuickPasteGroup[];
  focus: TPasteFocus;
  hasOnlyRecent: boolean;
  listRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  onHover: (index: number, point: TPastePoint) => void;
  onPress: (index: number) => void;
  onRetry: () => void;
};

export type TPasteNotesProps = {
  group: TQuickPasteGroup;
  notes: TQuickPasteNotes | null;
  focus: TPasteFocus;
  listMaxHeight: number;
  listRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  onHover: (index: number) => void;
  onPress: (index: number) => void;
};

export type TPasteNotesSkeletonProps = {
  rows: number;
};

export type TPasteErrorProps = {
  onRetry: () => void;
};
