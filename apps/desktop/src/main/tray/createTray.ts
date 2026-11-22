import { Menu, nativeImage, shell, Tray, app } from 'electron';

import { TEngineStatus } from 'shared/types/engine.types';

import { TRAY_ICON } from '../main.constants';

import { TCreateTrayParams } from './createTray.types';

const ACCESSIBILITY_SETTINGS_URL =
  'x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility';

const INPUT_MONITORING_SETTINGS_URL =
  'x-apple.systempreferences:com.apple.preference.security?Privacy_ListenEvent';

function toToolTip(status: TEngineStatus, shortcutsOff: boolean, capturesOff: boolean): string {
  if (shortcutsOff) {
    return 'WispNote — shortcuts are off until Input Monitoring is allowed';
  }

  if (capturesOff) {
    return 'WispNote — captures are empty until Accessibility is allowed';
  }

  return `WispNote — engine ${status}`;
}

export function createTray({ engine, onShowPanel, onOpenMainWindow }: TCreateTrayParams): Tray {
  const tray = new Tray(nativeImage.createFromPath(TRAY_ICON));

  function render(): void {
    const running = engine.status === 'running';
    const shortcutsOff = running && !engine.tap && !process.env.WISPNOTE_NO_TAP;
    const capturesOff = running && !engine.accessibility;

    tray.setToolTip(toToolTip(engine.status, shortcutsOff, capturesOff));

    tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: 'Open WispNote', click: onOpenMainWindow },
        { label: 'Show panel', click: onShowPanel },
        { type: 'separator' },
        {
          label: 'Shortcuts are off: allow WispNote in Input Monitoring…',
          visible: shortcutsOff,
          click: () => shell.openExternal(INPUT_MONITORING_SETTINGS_URL),
        },
        {
          label: 'Captures are empty: allow WispNote in Accessibility…',
          visible: capturesOff,
          click: () => shell.openExternal(ACCESSIBILITY_SETTINGS_URL),
        },
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
  engine.on('tap', render);
  engine.on('accessibility', render);

  return tray;
}
