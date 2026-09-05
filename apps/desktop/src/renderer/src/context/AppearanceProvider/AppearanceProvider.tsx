import { createContext, useMemo } from 'react';

import { TColorScheme } from 'shared/types/settings.types';

import useIsDark from 'hooks/useIsDark';
import { getPaletteById } from 'theme/palettes';

import { INITIAL_APPEARANCE_CONTEXT } from './AppearanceProvider.constants';
import { useAppearanceSettings } from './AppearanceProvider.hooks';
import { TAppearanceContext, TAppearanceProviderProps } from './AppearanceProvider.types';

export const AppearanceContext = createContext<TAppearanceContext>(INITIAL_APPEARANCE_CONTEXT);

function AppearanceProvider({
  children,
  colorScheme: colorSchemeOverride,
  paletteId: paletteIdOverride,
}: TAppearanceProviderProps) {
  const { settings, updateSettings } = useAppearanceSettings();

  const colorScheme = colorSchemeOverride ?? settings.colorScheme;
  const paletteId = paletteIdOverride ?? settings.paletteId;
  const isDark = useIsDark({ colorScheme });

  const value = useMemo<TAppearanceContext>(() => {
    const palette = getPaletteById(paletteId);

    function setColorScheme(next: TColorScheme) {
      updateSettings({ colorScheme: next });
    }

    function setPaletteId(next: string) {
      updateSettings({ paletteId: next });
    }

    return {
      colorScheme,
      paletteId: palette.id,
      palette,
      colors: isDark ? palette.dark : palette.light,
      isDark,
      setColorScheme,
      setPaletteId,
    };
  }, [colorScheme, paletteId, isDark, updateSettings]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export default AppearanceProvider;
