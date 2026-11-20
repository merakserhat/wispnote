import { TQuickPasteState } from 'shared/types/quickPaste.types';

import { TPasteFocus, TPasteMeasure } from './QuickPaste.types';

export const GROUPS_WIDTH = 220;
export const NOTES_WIDTH = 360;
export const PANEL_RADIUS = 12;
export const PANEL_GAP = 4;
export const SCREEN_MARGIN = 8;

export const CARET_GAP = 6;
export const CARET_INSET = 8;

export const GROUP_ROW_HEIGHT = 30;
export const GROUP_ROWS_MAX = 10;
export const GROUP_ICON_SIZE = 15;
export const CHEVRON_SIZE = 12;
export const ROW_RADIUS = 8;
export const SOURCE_DOT_SIZE = 7;

export const NOTE_LIST_MAX_HEIGHT = 380;
export const NOTE_LEAD = 6;

export const NO_GROUP = -1;

export const AIM_REST_MS = 150;

export const LOAD_MORE_DISTANCE = 240;

export const HIT_SELECTOR = '[data-paste-hit]';
export const FOCUSED_ROW_SELECTOR = '[data-focused="true"]';

export const EASE_OUT = 'cubic-bezier(.22,1,.36,1)';

export const SKELETON_GROUP_WIDTHS = [96, 132, 112, 84, 120];
export const SKELETON_NOTE_ROWS_MAX = 5;
export const SKELETON_NOTE_ROWS_UNKNOWN = 3;

export const INITIAL_STATE: TQuickPasteState = {
  open: false,
  openId: 0,
  anchor: { x: 0, y: 0, width: 0, height: 0 },
  frame: { width: 0, height: 0 },
  load: 'loading',
  groups: [],
  notes: {},
};

export const INITIAL_FOCUS: TPasteFocus = { group: NO_GROUP, column: 'groups', note: 0 };

export const INITIAL_MEASURE: TPasteMeasure = { groupsHeight: 0, rowOffset: 0, notesHeight: 0 };
