import { Menu, nativeImage, shell, Tray, app } from 'electron';

import { TEngineStatus } from 'shared/types/engine.types';

import { Engine } from '../engine';

const STATUS_ICON: Record<TEngineStatus, string> = {
  running: '✎',
  starting: '◌',
  unhealthy: '⚠',
  failed: '✕',
  stopped: '·',
};

/**
 * The menu-bar presence.
 *
 * Doubles as the engine's health indicator: the glyph is the only place a user
 * can see that capture has stopped working.
 */
export const createTray = (engine: Engine, onTestPanel: () => void): Tray => {
  // An empty image plus a text title; a template icon can come later.
  const tray = new Tray(nativeImage.createEmpty());

  const render = (): void => {
    tray.setTitle(STATUS_ICON[engine.status] ?? '✎');
    tray.setToolTip(`WispNote — engine ${engine.status}`);

    tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: `Engine: ${engine.status}`, enabled: false },
        { label: `PID: ${engine.ready?.pid ?? '—'}`, enabled: false },
        { type: 'separator' },
        { label: 'Show panel', click: onTestPanel },
        {
          label: 'Restart engine',
          click: () => {
            engine.failures = 0;
            engine.kill();
          },
        },
        {
          label: 'Open data folder',
          click: () => {
            if (engine.ready) {
              shell.openPath(engine.ready.data_dir);
            }
          },
        },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() },
      ])
    );
  };

  render();
  engine.on('status', render);
  engine.on('ready', render);

  return tray;
};
