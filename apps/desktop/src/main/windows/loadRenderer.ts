import { BrowserWindow } from 'electron';
import path from 'path';

/**
 * Point a window at its renderer entry.
 *
 * electron-vite serves the renderer from a dev server while developing and
 * from `out/renderer` once built; each window is its own HTML entry.
 */
export const loadRenderer = (window: BrowserWindow, entry: 'panel' | 'hud'): void => {
  const devServerUrl = process.env.ELECTRON_RENDERER_URL;

  if (devServerUrl) {
    window.loadURL(`${devServerUrl}/${entry}.html`);
    return;
  }

  window.loadFile(path.join(__dirname, `../renderer/${entry}.html`));
};
