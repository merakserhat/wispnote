import { TAppearanceSettings } from 'shared/types/settings.types';

export type TSettingsStore = {
  get: () => TAppearanceSettings;
  update: (patch: Partial<TAppearanceSettings>) => TAppearanceSettings;
};
