import { app } from 'electron';
import path from 'path';

import { TCaptureResult } from 'shared/types/engine.types';

import { createActions } from './actions';
import { createEngine } from './engine';
import { log } from './helpers';
import { createCaptureHud } from './hud';
import { registerIpcHandlers } from './ipc';
import { registerShutdown } from './lifecycle';
import { createSettingsStore } from './settings';
import { createTray } from './tray';
import { CaptureHudWindow, MainWindow } from './windows';

app.whenReady().then(() => {
  app.dock?.hide();

  const settings = createSettingsStore();
  const preloadPath = path.join(__dirname, '../preload/preload.js');

  const hudWindow = new CaptureHudWindow();
  hudWindow.create(preloadPath);

  const mainWindow = new MainWindow();
  mainWindow.create(preloadPath);

  log('host', 'starting — Ctrl+C or the menu bar to quit');
  const engine = createEngine({ app });
  const hud = createCaptureHud({ engine, window: hudWindow });
  const actions = createActions({ engine, hud, mainWindow });

  async function showPanelFromMenu(): Promise<void> {
    try {
      const result = await engine.request<TCaptureResult>('capture');
      hud.open(result);
    } catch (error) {
      log('error', `capture failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  registerIpcHandlers({ actions, settings });
  createTray({
    engine,
    onShowPanel: showPanelFromMenu,
    onOpenMainWindow: () => mainWindow.show(),
  });
  registerShutdown({ app, engine });
});
