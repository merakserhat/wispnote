export const PANEL_WIDTH = 360;
export const PANEL_HEIGHT = 268;

/** Gap between the cursor and the panel's top edge. */
export const PANEL_CURSOR_OFFSET = 18;

/** Keep-inside-the-screen margin. */
export const PANEL_SCREEN_MARGIN = 8;

/**
 * A blur arriving this soon after `show()` is the window settling, not the user
 * leaving. Acting on it would dismiss the note field mid-type.
 */
export const BLUR_GRACE_MS = 400;
