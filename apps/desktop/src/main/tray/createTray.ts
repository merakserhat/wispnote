import { Menu, nativeImage, Tray, app } from 'electron';

import { TEngineStatus } from 'shared/types/engine.types';

import { TCreateTrayParams } from './createTray.types';

const STATUS_ICON: Record<TEngineStatus, string> = {
  running: '✎',
  starting: '◌',
  unhealthy: '⚠',
  failed: '✕',
  stopped: '·',
};

export function createTray({ engine, onShowPanel, onOpenMainWindow }: TCreateTrayParams): Tray {
  const tray = new Tray(nativeImage.createEmpty());

  function render(): void {
    tray.setTitle(STATUS_ICON[engine.status] ?? '✎');
    tray.setToolTip(`WispNote — engine ${engine.status}`);

    tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: 'Open WispNote', click: onOpenMainWindow },
        { label: 'Show panel', click: onShowPanel },
        { type: 'separator' },
        { label: `Engine: ${engine.status}`, enabled: false },
        { label: `PID: ${engine.ready?.pid ?? '—'}`, enabled: false },
        {
          label: 'Restart engine',
          click: () => {
            engine.failures = 0;
            engine.kill();
          },
        },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() },
      ])
    );
  }

  render();
  engine.on('status', render);
  engine.on('ready', render);

  return tray;
}
