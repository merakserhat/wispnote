import { BrowserWindow, screen } from 'electron';

import { IPC_CHANNELS } from 'shared/constants/channels';
import { TToastPayload } from 'shared/types/ipc.types';

import {
  HUD_DURATION_MS,
  HUD_FADE_MS,
  HUD_HEIGHT,
  HUD_TOP_MARGIN,
  HUD_WIDTH,
} from './hudWindow.constants';
import { loadRenderer } from './loadRenderer';

/**
 * The "Highlight saved" confirmation.
 *
 * Every toast needs this, not just the ones raised while the panel happens to
 * be open: `quick_highlight` and `sync_source` finish inside the engine without
 * ever showing a panel, and with nothing on screen a working save is
 * indistinguishable from a broken shortcut.
 */
export class HudWindow {
  private window: BrowserWindow | null = null;

  private hideTimer: NodeJS.Timeout | null = null;

  private fadeTimer: NodeJS.Timeout | null = null;

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
      // Never focusable: a confirmation must not take the keyboard even for the
      // instant it is on screen.
      focusable: false,

      vibrancy: 'hud',
      visualEffectState: 'active',
      backgroundColor: '#00000000',
      hasShadow: true,
      roundedCorners: true,

      webPreferences: {
        preload: preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    // Above the panel, and clicks pass straight through to whatever is behind.
    this.window.setAlwaysOnTop(true, 'status');
    this.window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    this.window.setIgnoreMouseEvents(true);

    loadRenderer(this.window, 'hud');

    return this.window;
  }

  show(payload: TToastPayload): void {
    if (!this.window) {
      return;
    }

    this.clearTimers();
    this.position();

    this.window.webContents.send(IPC_CHANNELS.toastShow, payload);
    this.window.showInactive();

    this.hideTimer = setTimeout(() => {
      this.window?.webContents.send(IPC_CHANNELS.toastHide);
      // Hide only once the fade has finished, or it vanishes instead.
      this.fadeTimer = setTimeout(() => this.window?.hide(), HUD_FADE_MS);
    }, HUD_DURATION_MS);
  }

  /** Top-centre of whichever display the cursor is on - where the user looks. */
  private position(): void {
    if (!this.window) {
      return;
    }
    const { workArea } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    this.window.setPosition(
      Math.round(workArea.x + (workArea.width - HUD_WIDTH) / 2),
      Math.round(workArea.y + HUD_TOP_MARGIN),
      false
    );
  }

  private clearTimers(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    if (this.fadeTimer) {
      clearTimeout(this.fadeTimer);
    }
  }
}
