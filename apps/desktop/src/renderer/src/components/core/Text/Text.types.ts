import { ReactNode } from 'react';

import { TTextVariantKeys, TThemePrimitives } from 'theme/theme.types';

export type TTextProps = {
  variant?: TTextVariantKeys;
  color?: keyof TThemePrimitives;
  truncate?: boolean;
  muted?: boolean;
  children?: ReactNode;
  className?: string;
};

export type TTextStyleProps = {
  $variant?: TTextVariantKeys;
  $color?: keyof TThemePrimitives;
  $truncate?: boolean;
  $muted?: boolean;
};
