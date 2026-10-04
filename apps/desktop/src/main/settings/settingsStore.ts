import { app, nativeTheme, webContents } from 'electron';
import fs from 'fs';
import path from 'path';

import { DEFAULT_APPEARANCE_SETTINGS } from 'shared/constants/appearance';
import { IPC_CHANNELS } from 'shared/constants/channels';
import { TAppearanceSettings } from 'shared/types/settings.types';

import { log } from '../helpers';
import { SETTINGS_FILE } from './settingsStore.constants';
import { TSettingsStore } from './settingsStore.types';

function getFilePath(): string {
  return path.join(app.getPath('userData'), SETTINGS_FILE);
}

function read(): TAppearanceSettings {
  try {
    if (fs.existsSync(getFilePath())) {
      const stored = JSON.parse(fs.readFileSync(getFilePath(), 'utf8'));
      return { ...DEFAULT_APPEARANCE_SETTINGS, ...stored };
    }
  } catch (error) {
    log('error', `could not read settings: ${String(error)}`);
  }

  return { ...DEFAULT_APPEARANCE_SETTINGS };
}

function persist(settings: TAppearanceSettings): void {
  try {
    fs.writeFileSync(getFilePath(), JSON.stringify(settings, null, 2));
  } catch (error) {
    log('error', `could not persist settings: ${String(error)}`);
  }
}

// INFO: (serhat) vibrancy and native chrome follow nativeTheme, not CSS - the
// sidebar would stay light under a dark sheet without this.
function applyNativeTheme(settings: TAppearanceSettings): void {
  nativeTheme.themeSource = settings.colorScheme;
}

function broadcast(settings: TAppearanceSettings): void {
  webContents.getAllWebContents().forEach((contents) => {
    contents.send(IPC_CHANNELS.settingsChanged, settings);
  });
}

export function createSettingsStore(): TSettingsStore {
  let settings = read();
  applyNativeTheme(settings);

  return {
    get: () => settings,
    update: (patch) => {
      settings = { ...settings, ...patch };
      persist(settings);
      applyNativeTheme(settings);
      broadcast(settings);
      log('settings', `appearance → ${settings.colorScheme} / ${settings.paletteId}`);
      return settings;
    },
  };
}
