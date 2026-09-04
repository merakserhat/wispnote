import { app } from 'electron';
import path from 'path';

import { TCaptureResult } from 'shared/types/engine.types';

import { createActions } from './actions';
import { createEngine } from './engine';
import { log } from './helpers';
import { registerIpcHandlers } from './ipc';
import { registerShutdown } from './lifecycle';
import { createTray } from './tray';
import { createPanelController, HudWindow, MainWindow, PanelWindow } from './windows';

app.whenReady().then(() => {
  app.dock?.hide();

  const preloadPath = path.join(__dirname, '../preload/preload.js');

  const panel = new PanelWindow();
  panel.create(preloadPath);

  const hud = new HudWindow();
  hud.create(preloadPath);

  const mainWindow = new MainWindow();
  mainWindow.create(preloadPath);

  const controller = createPanelController(panel);

  log('host', 'starting — Ctrl+C or the menu bar to quit');
  const engine = createEngine({ app });
  const actions = createActions({ engine, hud, panel, controller, mainWindow });

  async function showPanelFromMenu(): Promise<void> {
    try {
      const result = await engine.request<TCaptureResult>('capture');
      controller.show({ action: 'show_panel', context: result.context, can_sync: result.can_sync });
    } catch (error) {
      log('error', `capture failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  registerIpcHandlers({ actions, panel });
  createTray({
    engine,
    onShowPanel: showPanelFromMenu,
    onOpenMainWindow: () => mainWindow.show(),
  });
  registerShutdown({ app, engine });
});
