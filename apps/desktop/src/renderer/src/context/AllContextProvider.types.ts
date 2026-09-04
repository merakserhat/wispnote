import { TColorScheme } from 'theme/theme.types';
import { TChildrenOnly } from 'types/common';

export type TAllContextProviderProps = TChildrenOnly & {
  colorScheme?: TColorScheme;
};
