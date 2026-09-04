import type lightThemePrimitives from './lightThemePrimitives';
import type space from './space';
import type textVariants from './textVariants';
import type { theme } from './theme';

export type TThemePrimitives = Record<keyof typeof lightThemePrimitives, string>;

export type TTheme = Omit<typeof theme, 'colors'> & {
  colors: TThemePrimitives;
};

export type TTextVariantKeys = keyof typeof textVariants;

export type TSpacing = keyof typeof space;

export type TColorScheme = 'system' | 'light' | 'dark';
