import { BrowserWindow, screen } from 'electron';

import { IPC_CHANNELS } from 'shared/constants/channels';
import { TCaretRect } from 'shared/types/capture.types';
import { TQuickPastePlacement, TQuickPasteState } from 'shared/types/quickPaste.types';

import { loadRenderer } from './loadRenderer';
import { lockNavigation } from './lockNavigation';
import {
  PASTE_BLUR_GRACE_MS,
  PASTE_CARET_MAX_HEIGHT,
  PASTE_POINTER_HEIGHT,
  PASTE_WINDOW_HEIGHT,
  PASTE_WINDOW_WIDTH,
} from './quickPasteWindow.constants';

function isOnScreen(caret: TCaretRect): boolean {
  return screen.getAllDisplays().some(({ bounds }) => {
    const insideX = caret.x >= bounds.x && caret.x <= bounds.x + bounds.width;
    const insideY = caret.y >= bounds.y && caret.y <= bounds.y + bounds.height;
    return insideX && insideY;
  });
}

function toAnchor(caret: TCaretRect | null): TCaretRect {
  const usable =
    caret !== null &&
    caret.height <= PASTE_CARET_MAX_HEIGHT &&
    !(caret.x === 0 && caret.y === 0) &&
    isOnScreen(caret);

  if (usable) {
    return caret;
  }

  const cursor = screen.getCursorScreenPoint();
  return { x: cursor.x, y: cursor.y, width: 0, height: PASTE_POINTER_HEIGHT };
}

// INFO: (serhat) the paste menu's window: transparent like the HUD's, with the panels drawn in CSS
// and clicks passing through everywhere else. Unlike the HUD it takes the keyboard the moment it shows and gives it back by hiding.
export class QuickPasteWindow {
  private window: BrowserWindow | null = null;

  private shownAt = 0;

  private blurHandler: (() => void) | null = null;

  create(preloadPath: string): BrowserWindow {
    this.window = new BrowserWindow({
      width: PASTE_WINDOW_WIDTH,
      height: PASTE_WINDOW_HEIGHT,
      show: false,
      frame: false,
      resizable: false,
      movable: false,
      skipTaskbar: true,

      type: 'panel',
      alwaysOnTop: true,
      acceptFirstMouse: true,

      transparent: true,
      backgroundColor: '#00000000',
      hasShadow: false,

      webPreferences: {
        preload: preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
        backgroundThrottling: false,
      },
    });

    this.window.setAlwaysOnTop(true, 'floating');
    this.window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    this.setClickThrough(true);

    this.window.on('blur', () => {
      if (Date.now() - this.shownAt < PASTE_BLUR_GRACE_MS) {
        return;
      }
      this.blurHandler?.();
    });

    lockNavigation(this.window);

    loadRenderer(this.window, 'paste');

    return this.window;
  }

  onBlur(handler: () => void): void {
    this.blurHandler = handler;
  }

  render(state: TQuickPasteState): void {
    this.window?.webContents.send(IPC_CHANNELS.quickPasteState, state);
  }

  // INFO: (serhat) show() on a panel makes it key without activating the app, so the app that
  // gets the paste stays frontmost and keeps its caret.
  takeKeyboard(): void {
    if (!this.window) {
      return;
    }
    this.shownAt = Date.now();
    this.window.show();
    this.window.webContents.focus();
  }

  hide(): void {
    if (this.window?.isVisible()) {
      this.window.hide();
    }
  }

  setClickThrough(ignore: boolean): void {
    this.window?.setIgnoreMouseEvents(ignore, { forward: true });
  }

  // INFO: (serhat) the window covers the work area of the caret's screen, so the notes panel can
  // open on either side of the groups panel; the caret comes back in the window's own coordinates.
  place(caret: TCaretRect | null): TQuickPastePlacement {
    const anchor = toAnchor(caret);
    const { workArea } = screen.getDisplayNearestPoint({ x: anchor.x, y: anchor.y });

    this.window?.setBounds(workArea, false);

    return {
      anchor: { ...anchor, x: anchor.x - workArea.x, y: anchor.y - workArea.y },
      frame: { width: workArea.width, height: workArea.height },
    };
  }
}
