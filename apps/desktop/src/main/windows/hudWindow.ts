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
      this.fadeTimer = setTimeout(() => this.window?.hide(), HUD_FADE_MS);
    }, HUD_DURATION_MS);
  }

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
