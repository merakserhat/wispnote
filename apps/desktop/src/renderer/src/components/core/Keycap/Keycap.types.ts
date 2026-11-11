import { TSpacing, TTextVariantKeys, TThemePrimitives } from 'theme/theme.types';

export type TKeycapProps = {
  label: string;
  glyph?: string;
  size?: TKeycapSize;
};

export type TKeycapSize = 'small' | 'medium' | 'large';

export type TKeycapSizeProperty = {
  height: number;
  px: TSpacing;
  borderRadius: number;
  borderBottomWidth: number;
  textVariant: TTextVariantKeys;
  textColor: keyof TThemePrimitives;
  backgroundColor?: keyof TThemePrimitives;
};
export type TKeycapSizeMap = Record<TKeycapSize, TKeycapSizeProperty>;
