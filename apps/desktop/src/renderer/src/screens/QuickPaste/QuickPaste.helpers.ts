import {
  TQuickPasteGroup,
  TQuickPasteNotes,
  TQuickPasteState,
} from 'shared/types/quickPaste.types';

import {
  CARET_GAP,
  CARET_INSET,
  EASE_OUT,
  GROUPS_WIDTH,
  NO_GROUP,
  NOTE_LEAD,
  NOTE_LIST_MAX_HEIGHT,
  NOTES_WIDTH,
  PANEL_GAP,
  SCREEN_MARGIN,
  SKELETON_NOTE_ROWS_MAX,
  SKELETON_NOTE_ROWS_UNKNOWN,
} from './QuickPaste.constants';
import {
  TPasteFocus,
  TPasteLayout,
  TPasteMeasure,
  TPasteMode,
  TPasteMotion,
  TPastePoint,
  TPasteRowTone,
} from './QuickPaste.types';

const PANEL_BORDER = 2;

export function clampIndex(index: number, length: number): number {
  return length > 0 ? Math.min(Math.max(index, 0), length - 1) : 0;
}

export function wrapIndex(index: number, length: number): number {
  return length > 0 ? (index + length) % length : 0;
}

export function toGroupIndex(index: number, length: number): number {
  return index < 0 || length === 0 ? NO_GROUP : clampIndex(index, length);
}

export function stepGroup(index: number, step: number, length: number): number {
  if (length === 0) {
    return NO_GROUP;
  }
  if (index === NO_GROUP) {
    return step > 0 ? 0 : length - 1;
  }
  return wrapIndex(index + step, length);
}

export function getNotes(
  state: TQuickPasteState,
  group: TQuickPasteGroup | null
): TQuickPasteNotes | null {
  return group ? (state.notes[group.key] ?? null) : null;
}

export function hasNotes(notes: TQuickPasteNotes | null): boolean {
  return Boolean(notes && notes.items.length > 0);
}

export function getMode(state: TQuickPasteState): TPasteMode {
  if (state.load === 'error') {
    return 'error';
  }
  if (state.load === 'loading') {
    return 'first';
  }

  const hasGroups = state.groups.some((group) => !group.recent);
  const hasRecent = state.groups.some((group) => group.recent && group.noteCount > 0);

  return hasGroups || hasRecent ? 'browse' : 'nothing';
}

export function getGroupTone(index: number, focus: TPasteFocus): TPasteRowTone {
  if (index !== focus.group) {
    return 'idle';
  }
  return focus.column === 'groups' ? 'focused' : 'parent';
}

export function getSkeletonRows(group: TQuickPasteGroup): number {
  if (group.recent) {
    return SKELETON_NOTE_ROWS_UNKNOWN;
  }
  return Math.min(Math.max(group.noteCount, 1), SKELETON_NOTE_ROWS_MAX);
}

export function getLayout(state: TQuickPasteState, measure: TPasteMeasure): TPasteLayout {
  const { anchor, frame } = state;
  const { groupsHeight, rowOffset, notesHeight } = measure;

  const groupsLeft = Math.min(
    Math.max(anchor.x - CARET_INSET, SCREEN_MARGIN),
    frame.width - SCREEN_MARGIN - GROUPS_WIDTH
  );

  const underCaret = anchor.y + anchor.height + CARET_GAP;
  const below = underCaret + groupsHeight + SCREEN_MARGIN <= frame.height;
  const groupsTop = below
    ? underCaret
    : Math.max(anchor.y - CARET_GAP - groupsHeight, SCREEN_MARGIN);

  const fitsRight =
    groupsLeft + GROUPS_WIDTH + PANEL_GAP + NOTES_WIDTH <= frame.width - SCREEN_MARGIN;
  const notesLeft = fitsRight
    ? groupsLeft + GROUPS_WIDTH + PANEL_GAP
    : groupsLeft - PANEL_GAP - NOTES_WIDTH;

  const minTop = below ? groupsTop : SCREEN_MARGIN;
  const maxBottom = below ? frame.height - SCREEN_MARGIN : groupsTop + groupsHeight;
  const level = groupsTop + rowOffset - NOTE_LEAD;
  const notesTop = Math.max(minTop, Math.min(level, maxBottom - notesHeight));

  return {
    groupsLeft,
    groupsTop,
    notesLeft,
    notesTop,
    notesListMaxHeight: Math.max(
      0,
      Math.min(NOTE_LIST_MAX_HEIGHT, maxBottom - minTop - PANEL_BORDER)
    ),
  };
}

export function getMotion(open: boolean): TPasteMotion {
  if (!open) {
    return {
      opacity: 0,
      transition: 'opacity 110ms linear, visibility 0ms linear 110ms',
      visibility: 'hidden',
      pointerEvents: 'none',
    };
  }

  return {
    opacity: 1,
    transition: `opacity 140ms ${EASE_OUT}, visibility 0ms`,
    visibility: 'visible',
    pointerEvents: 'auto',
  };
}

function isInTriangle(
  point: TPastePoint,
  first: TPastePoint,
  second: TPastePoint,
  third: TPastePoint
): boolean {
  const one =
    (second.x - first.x) * (point.y - first.y) - (second.y - first.y) * (point.x - first.x);
  const two =
    (third.x - second.x) * (point.y - second.y) - (third.y - second.y) * (point.x - second.x);
  const three =
    (first.x - third.x) * (point.y - third.y) - (first.y - third.y) * (point.x - third.x);

  const hasNegative = one < 0 || two < 0 || three < 0;
  const hasPositive = one > 0 || two > 0 || three > 0;

  return !(hasNegative && hasPositive);
}

export function isAimingAt(previous: TPastePoint, point: TPastePoint, target: DOMRect): boolean {
  if (!target.width || (point.x > target.left && point.x < target.right)) {
    return false;
  }

  const nearX = point.x <= target.left ? target.left : target.right;
  if (Math.abs(nearX - point.x) >= Math.abs(nearX - previous.x)) {
    return false;
  }

  return isInTriangle(point, previous, { x: nearX, y: target.top }, { x: nearX, y: target.bottom });
}
