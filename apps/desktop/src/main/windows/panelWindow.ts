import { BrowserWindow, screen } from 'electron';
import path from 'path';

import { IPC_CHANNELS } from 'shared/constants/channels';
import { TPanelPayload } from 'shared/types/ipc.types';

import {
  BLUR_GRACE_MS,
  PANEL_CURSOR_OFFSET,
  PANEL_HEIGHT,
  PANEL_SCREEN_MARGIN,
  PANEL_WIDTH,
} from './panelWindow.constants';
import { loadRenderer } from './loadRenderer';

/**
 * The quick-action panel.
 *
 * `type: 'panel'` applies NSWindowStyleMaskNonactivatingPanel, which is what
 * lets this appear over the article being read without activating the app - and
 * so without invalidating the capture it was built from.
 */
export class PanelWindow {
  private window: BrowserWindow | null = null;

  private shownAt = 0;

  /** Built once at startup: creating on demand costs a flash and ~200ms. */
  create(preloadPath: string): BrowserWindow {
    this.window = new BrowserWindow({
      width: PANEL_WIDTH,
      height: PANEL_HEIGHT,
      show: false,
      frame: false,
      resizable: false,
      movable: false,
      skipTaskbar: true,

      type: 'panel',
      alwaysOnTop: true,

      vibrancy: 'popover',
      visualEffectState: 'active',
      // With vibrancy, `transparent: true` fights the effect view - a clear
      // backgroundColor is what lets the blur through.
      backgroundColor: '#00000000',
      hasShadow: true,
      roundedCorners: true,

      webPreferences: {
        preload: preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    this.window.setAlwaysOnTop(true, 'floating');
    this.window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    // Clicking away dismisses it, the way a real popover behaves.
    this.window.on('blur', () => {
      if (Date.now() - this.shownAt < BLUR_GRACE_MS) {
        return;
      }
      this.hide();
    });

    loadRenderer(this.window, 'panel');

    return this.window;
  }

  show(payload: TPanelPayload): void {
    if (!this.window) {
      return;
    }

    this.window.webContents.send(IPC_CHANNELS.panelRender, payload);
    this.position();

    if (payload.mode === 'note') {
      this.focus();
    } else {
      // Nothing to type into, so stay out of the way entirely: ordered front
      // without ever becoming key.
      this.shownAt = Date.now();
      this.window.showInactive();
    }
  }

  /**
   * Show the panel *and* give it the keyboard.
   *
   * Safe only because the window is `type: 'panel'`. Electron skips
   * `activateIgnoringOtherApps:` for panels and calls `makeKeyAndOrderFront:`
   * alone, so the window becomes key while the app the user is reading stays
   * frontmost. `showInactive()` never becomes key, and a text field inside it
   * cannot be typed into however much DOM focus it is given.
   */
  focus(): void {
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

  isVisible(): boolean {
    return Boolean(this.window?.isVisible());
  }

  /** Near the cursor, clamped to that display's work area. */
  private position(): void {
    if (!this.window) {
      return;
    }

    const cursor = screen.getCursorScreenPoint();
    const { workArea } = screen.getDisplayNearestPoint(cursor);

    const x = Math.min(
      Math.max(cursor.x - PANEL_WIDTH / 2, workArea.x + PANEL_SCREEN_MARGIN),
      workArea.x + workArea.width - PANEL_WIDTH - PANEL_SCREEN_MARGIN
    );
    const y = Math.min(
      Math.max(cursor.y + PANEL_CURSOR_OFFSET, workArea.y + PANEL_SCREEN_MARGIN),
      workArea.y + workArea.height - PANEL_HEIGHT - PANEL_SCREEN_MARGIN
    );

    this.window.setPosition(Math.round(x), Math.round(y), false);
  }
}

export const panelPreloadPath = (dirname: string): string =>
  path.join(dirname, '../preload/preload.js');
