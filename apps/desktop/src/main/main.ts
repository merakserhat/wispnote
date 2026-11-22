import { app } from 'electron';
import path from 'path';

import { TCaptureResult } from 'shared/types/engine.types';

import { createActions } from './actions';
import { createEngine } from './engine';
import { log } from './helpers';
import { createCaptureHud } from './hud';
import { registerIpcHandlers } from './ipc';
import { registerShutdown } from './lifecycle';
import { createQuickPaste } from './quickPaste';
import { createSettingsStore } from './settings';
import { createTray } from './tray';
import { CaptureHudWindow, MainWindow, QuickPasteWindow } from './windows';

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.whenReady().then(() => {
  if (app.dock?.isVisible()) {
    app.dock.hide();
  }

  const settings = createSettingsStore();
  const preloadPath = path.join(__dirname, '../preload/preload.js');

  const hudWindow = new CaptureHudWindow();
  hudWindow.create(preloadPath);

  const quickPasteWindow = new QuickPasteWindow();
  quickPasteWindow.create(preloadPath);

  const mainWindow = new MainWindow();
  mainWindow.create(preloadPath);

  log('host', 'starting — Ctrl+C or the menu bar to quit');
  const engine = createEngine({ app });
  const hud = createCaptureHud({ engine, window: hudWindow });
  const quickPaste = createQuickPaste({ engine, hud, window: quickPasteWindow });
  const actions = createActions({ engine, hud, quickPaste, mainWindow });

  async function showPanelFromMenu(): Promise<void> {
    try {
      const result = await engine.request<TCaptureResult>('capture');
      hud.open(result);
    } catch (error) {
      log('error', `capture failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  registerIpcHandlers({ actions, quickPaste, settings });
  createTray({
    engine,
    onShowPanel: showPanelFromMenu,
    onOpenMainWindow: () => mainWindow.show(),
  });
  registerShutdown({ app, engine });

  app.on('activate', () => mainWindow.reveal());
  app.on('second-instance', () => mainWindow.reveal());

  if (app.isPackaged) {
    mainWindow.show();
  }
});
