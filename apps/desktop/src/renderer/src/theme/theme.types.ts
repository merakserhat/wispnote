import type { TColorScheme } from 'shared/types/settings.types';

import type space from './space';
import type textVariants from './textVariants';
import type { theme } from './theme';

export type { TColorScheme };

export type TThemePrimitiveKey =
  | 'textPrimary'
  | 'textSecondary'
  | 'textTertiary'
  | 'textInverted'
  | 'textLink'
  | 'backgroundPrimary'
  | 'backgroundSecondary'
  | 'backgroundSecondaryActive'
  | 'backgroundTertiary'
  | 'backgroundElevated'
  | 'backgroundElevatedHover'
  | 'borderDivider'
  | 'borderOutline'
  | 'buttonPrimary'
  | 'buttonPrimaryHover'
  | 'buttonPrimaryOnTap'
  | 'buttonGhost'
  | 'statusPositivePrimary'
  | 'statusPositiveGhost'
  | 'statusWarningPrimary'
  | 'statusWarningGhost'
  | 'statusErrorPrimary'
  | 'statusErrorGhost'
  | 'sourceWeb'
  | 'sourcePdf'
  | 'sourceMail'
  | 'sourceApp'
  | 'sourceFile'
  | 'transparent';

export type TThemePrimitives = Record<TThemePrimitiveKey, string>;

export type TPaletteDefinition = {
  id: string;
  name: string;
  swatch: string[];
  light: TThemePrimitives;
  dark: TThemePrimitives;
};

export type TTheme = Omit<typeof theme, 'colors'> & {
  colors: TThemePrimitives;
};

export type TTextVariantKeys = keyof typeof textVariants;

export type TSpacing = keyof typeof space;
