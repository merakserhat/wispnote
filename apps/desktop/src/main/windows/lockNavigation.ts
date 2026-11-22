import { BrowserWindow } from 'electron';

function toDocumentUrl(url: string): string {
  return url.split(/[?#]/)[0];
}

export function lockNavigation(window: BrowserWindow): void {
  window.webContents.on('will-navigate', (event, url) => {
    if (toDocumentUrl(url) !== toDocumentUrl(window.webContents.getURL())) {
      event.preventDefault();
    }
  });

  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}
