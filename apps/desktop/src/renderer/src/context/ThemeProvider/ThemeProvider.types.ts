import { TColorScheme } from 'theme/theme.types';
import { TChildrenOnly } from 'types/common';

export type TThemeProviderProps = TChildrenOnly & {
  colorScheme?: TColorScheme;
};
