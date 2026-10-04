import { CSSProperties, ReactNode } from 'react';
import { SpaceProps, TextAlignProps } from 'styled-system';

import { TTextVariantKeys, TTheme, TThemePrimitives } from 'theme/theme.types';

export type TTextProps = SpaceProps<TTheme> &
  TextAlignProps<TTheme> & {
    as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'label' | 'div';
    variant?: TTextVariantKeys;
    color?: keyof TThemePrimitives;
    numberOfLines?: number;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    htmlFor?: string;
  };

export type TTextStyleProps = SpaceProps<TTheme> &
  TextAlignProps<TTheme> & {
    $variant: TTextVariantKeys;
    $color: keyof TThemePrimitives;
    $numberOfLines?: number;
  };
