import { theme } from './theme';

export type TThemePrimitives = Record<keyof typeof theme.colors, string>;

export type TTheme = Omit<typeof theme, 'colors'> & {
  colors: TThemePrimitives;
};

export type TTextVariantKeys = keyof TTheme['textVariants'];

export type TSpacing = keyof TTheme['space'];
