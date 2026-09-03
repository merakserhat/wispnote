import { BrowserWindow } from 'electron';
import path from 'path';

import { TRendererEntry } from './loadRenderer.types';

export function loadRenderer(window: BrowserWindow, entry: TRendererEntry): void {
  const devServerUrl = process.env.ELECTRON_RENDERER_URL;

  if (devServerUrl) {
    window.loadURL(`${devServerUrl}/${entry}.html`);
    return;
  }

  window.loadFile(path.join(__dirname, `../renderer/${entry}.html`));
}
