import { app, BrowserWindow } from 'electron';

import {
  MAIN_WINDOW_HEIGHT,
  MAIN_WINDOW_MIN_HEIGHT,
  MAIN_WINDOW_MIN_WIDTH,
  MAIN_WINDOW_TRAFFIC_LIGHT_POSITION,
  MAIN_WINDOW_WIDTH,
} from './mainWindow.constants';
import { loadRenderer } from './loadRenderer';

export class MainWindow {
  private window: BrowserWindow | null = null;

  private isQuitting = false;

  create(preloadPath: string): BrowserWindow {
    this.window = new BrowserWindow({
      width: MAIN_WINDOW_WIDTH,
      height: MAIN_WINDOW_HEIGHT,
      minWidth: MAIN_WINDOW_MIN_WIDTH,
      minHeight: MAIN_WINDOW_MIN_HEIGHT,
      show: false,

      titleBarStyle: 'hiddenInset',
      trafficLightPosition: MAIN_WINDOW_TRAFFIC_LIGHT_POSITION,

      vibrancy: 'sidebar',
      visualEffectState: 'active',
      backgroundColor: '#00000000',

      webPreferences: {
        preload: preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    app.on('before-quit', () => {
      this.isQuitting = true;
    });

    // INFO: (serhat) closing hides the window - quitting happens from the tray.
    this.window.on('close', (event) => {
      if (this.isQuitting) {
        return;
      }

      event.preventDefault();
      this.hide();
    });

    loadRenderer(this.window, 'main');

    return this.window;
  }

  show(): void {
    if (!this.window) {
      return;
    }

    app.dock?.show();
    this.window.show();
    this.window.focus();
  }

  hide(): void {
    this.window?.hide();
    app.dock?.hide();
  }

  isVisible(): boolean {
    return Boolean(this.window?.isVisible());
  }
}
