import { BrowserWindow, screen } from 'electron';

import { IPC_CHANNELS } from 'shared/constants/channels';
import { TCaptureHudState } from 'shared/types/captureHud.types';

import {
  BLUR_GRACE_MS,
  HUD_CURSOR_OFFSET,
  HUD_DESIGN_HEIGHT,
  HUD_HEIGHT,
  HUD_SCREEN_MARGIN,
  HUD_SEED_X,
  HUD_SEED_Y,
  HUD_WIDTH,
} from './captureHudWindow.constants';
import { loadRenderer } from './loadRenderer';

// INFO: (serhat) one transparent window for every capture state. The shape is drawn in CSS, so the
// window never resizes or moves while a state is up, and outside the shape clicks pass through.
export class CaptureHudWindow {
  private window: BrowserWindow | null = null;

  private shownAt = 0;

  private blurHandler: (() => void) | null = null;

  create(preloadPath: string): BrowserWindow {
    this.window = new BrowserWindow({
      width: HUD_WIDTH,
      height: HUD_HEIGHT,
      show: false,
      frame: false,
      resizable: false,
      movable: false,
      skipTaskbar: true,

      type: 'panel',
      alwaysOnTop: true,
      // INFO: (serhat) a card left open by a click away is clicked while the window is not key.
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
      if (Date.now() - this.shownAt < BLUR_GRACE_MS) {
        return;
      }
      this.blurHandler?.();
    });

    loadRenderer(this.window, 'hud');

    return this.window;
  }

  onBlur(handler: () => void): void {
    this.blurHandler = handler;
  }

  render(state: TCaptureHudState): void {
    this.window?.webContents.send(IPC_CHANNELS.hudState, state);
  }

  // INFO: (serhat) safe only because the window is a panel: show() makes it key without activating
  // the app, so the app being read stays frontmost.
  takeKeyboard(): void {
    if (!this.window) {
      return;
    }
    this.shownAt = Date.now();
    this.window.show();
    this.window.webContents.focus();
  }

  showPassive(): void {
    if (this.window && !this.window.isVisible()) {
      this.window.showInactive();
    }
  }

  setClickThrough(ignore: boolean): void {
    this.window?.setIgnoreMouseEvents(ignore, { forward: true });
  }

  hide(): void {
    if (this.window?.isVisible()) {
      this.window.hide();
    }
  }

  // INFO: (serhat) the seed lands 18px under the cursor tip, clamped by the drawn 320px rather than
  // the full window height so the spare room at the bottom does not push the shape up.
  place(): void {
    if (!this.window) {
      return;
    }

    const cursor = screen.getCursorScreenPoint();
    const { workArea } = screen.getDisplayNearestPoint(cursor);

    const x = Math.min(
      Math.max(cursor.x - HUD_SEED_X, workArea.x + HUD_SCREEN_MARGIN),
      workArea.x + workArea.width - HUD_WIDTH - HUD_SCREEN_MARGIN
    );
    const y = Math.min(
      Math.max(cursor.y + HUD_CURSOR_OFFSET - HUD_SEED_Y, workArea.y + HUD_SCREEN_MARGIN),
      workArea.y + workArea.height - HUD_DESIGN_HEIGHT - HUD_SCREEN_MARGIN
    );

    this.window.setPosition(Math.round(x), Math.round(y), false);
  }
}
