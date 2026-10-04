import { useContext, useEffect, useState } from 'react';

import { DEFAULT_APPEARANCE_SETTINGS } from 'shared/constants/appearance';
import { TAppearanceSettings } from 'shared/types/settings.types';

import { AppearanceContext } from './AppearanceProvider';

export function useAppearance() {
  return useContext(AppearanceContext);
}

export function useAppearanceSettings() {
  const [settings, setSettings] = useState<TAppearanceSettings>(DEFAULT_APPEARANCE_SETTINGS);
  const bridge = typeof window === 'undefined' ? undefined : window.wisp;

  useEffect(() => {
    if (!bridge) {
      return undefined;
    }

    bridge.getSettings().then(setSettings);

    return bridge.onSettingsChanged(setSettings);
  }, [bridge]);

  function updateSettings(patch: Partial<TAppearanceSettings>) {
    setSettings((current) => ({ ...current, ...patch }));
    bridge?.setSettings(patch);
  }

  return { settings, updateSettings };
}
