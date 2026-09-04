import { TColorScheme, TThemePrimitives } from 'theme/theme.types';
import { TChildrenOnly } from 'types/common';

export type TAntdProviderProps = TChildrenOnly & {
  colorScheme?: TColorScheme;
};

export type TBuildAntdThemeParams = {
  colors: TThemePrimitives;
  isDark: boolean;
};
