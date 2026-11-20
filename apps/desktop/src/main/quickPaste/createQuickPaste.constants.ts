import { TQuickPasteState } from 'shared/types/quickPaste.types';

export const RECENT_GROUP_KEY = 'recent';
export const RECENT_GROUP_TITLE = 'Recent';

export const CLOSED_STATE: TQuickPasteState = {
  open: false,
  openId: 0,
  anchor: { x: 0, y: 0, width: 0, height: 0 },
  frame: { width: 0, height: 0 },
  load: 'loading',
  groups: [],
  notes: {},
};

export const FIRST_PAGE = 0;
export const NOTES_PAGE_SIZE = 50;
export const SOURCES_PAGE_SIZE = 200;

// INFO: (serhat) the first groups are fetched with the menu, so moving onto one shows its notes
// without a wait; the rest load when they get the focus.
export const PREFETCH_GROUP_COUNT = 8;

// INFO: (serhat) the shape's fade from Paste-Behaviour; the window goes when it ends.
export const CLOSE_FADE_MS = 110;

// INFO: (serhat) hiding the panel gives the keyboard back to the app; ⌘V posted sooner than this
// can still land in the panel.
export const KEYBOARD_RETURN_MS = 60;
