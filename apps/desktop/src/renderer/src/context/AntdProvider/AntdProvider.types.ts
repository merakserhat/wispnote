import { TThemePrimitives } from 'theme/theme.types';
import { TChildrenOnly } from 'types/common';

export type TAntdProviderProps = TChildrenOnly;

export type TBuildAntdThemeParams = {
  colors: TThemePrimitives;
  isDark: boolean;
};
