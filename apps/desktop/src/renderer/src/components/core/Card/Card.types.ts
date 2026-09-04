import { TBoxProps } from 'components/core/Box/Box.types';

export type TCardVariant = 'flat' | 'outlined' | 'elevated';

export type TCardProps = TBoxProps & {
  variant?: TCardVariant;
};

export type TCardVariantProperty = Pick<
  TBoxProps,
  'backgroundColor' | 'borderColor' | 'borderWidth'
> & {
  elevated: boolean;
};
export type TCardVariantMap = Record<TCardVariant, TCardVariantProperty>;

export type TStyledCardProps = {
  $elevated: boolean;
};
