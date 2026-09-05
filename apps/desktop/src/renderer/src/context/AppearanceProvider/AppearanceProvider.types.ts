import { TAppearanceSettings, TColorScheme } from 'shared/types/settings.types';

import { TPaletteDefinition, TThemePrimitives } from 'theme/theme.types';
import { TChildrenOnly } from 'types/common';

export type TAppearanceContext = TAppearanceSettings & {
  palette: TPaletteDefinition;
  colors: TThemePrimitives;
  isDark: boolean;
  setColorScheme: (colorScheme: TColorScheme) => void;
  setPaletteId: (paletteId: string) => void;
};

export type TAppearanceProviderProps = TChildrenOnly & {
  colorScheme?: TColorScheme;
  paletteId?: string;
};
