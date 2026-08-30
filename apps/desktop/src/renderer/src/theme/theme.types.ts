import { theme } from './theme';

export type TTheme = typeof theme;

export type TThemePrimitives = TTheme['colors'];

export type TTextVariantKeys = keyof TTheme['textVariants'];

export type TSpacing = keyof TTheme['space'];
