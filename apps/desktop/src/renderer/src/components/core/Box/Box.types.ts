import { CSSProperties, ReactNode } from 'react';
import { BorderProps, FlexboxProps, LayoutProps, PositionProps, SpaceProps } from 'styled-system';

import { TSpacing, TTheme, TThemePrimitives } from 'theme/theme.types';

export type TBoxStyleProps = SpaceProps<TTheme> &
  LayoutProps<TTheme> &
  FlexboxProps<TTheme> &
  PositionProps<TTheme> &
  Omit<BorderProps<TTheme>, 'borderColor' | 'borderRadius' | 'borderWidth'> & {
    borderWidth?: number;
    backgroundColor?: keyof TThemePrimitives;
    borderColor?: keyof TThemePrimitives;
    borderRadius?: number;
    gap?: TSpacing;
    cursor?: CSSProperties['cursor'];
  };

export type TBoxProps = TBoxStyleProps & {
  as?: 'div' | 'section' | 'header' | 'main' | 'nav' | 'aside' | 'article' | 'span';
  children?: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
};
