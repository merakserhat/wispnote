import { DEFAULT_APPEARANCE_SETTINGS } from 'shared/constants/appearance';

import { DEFAULT_PALETTE } from 'theme/palettes';

import { TAppearanceContext } from './AppearanceProvider.types';

export const INITIAL_APPEARANCE_CONTEXT: TAppearanceContext = {
  ...DEFAULT_APPEARANCE_SETTINGS,
  palette: DEFAULT_PALETTE,
  colors: DEFAULT_PALETTE.light,
  isDark: false,
  setColorScheme: () => undefined,
  setPaletteId: () => undefined,
};
