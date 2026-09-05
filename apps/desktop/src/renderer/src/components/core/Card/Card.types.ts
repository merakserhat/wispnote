import { TBoxProps } from 'components/core/Box/Box.types';

export type TCardVariant = 'flat' | 'outlined' | 'elevated';

export type TCardProps = TBoxProps & {
  variant?: TCardVariant;
  onPress?: () => void;
};

export type TCardVariantProperty = Pick<TBoxProps, 'backgroundColor' | 'borderColor'> & {
  borderWidth: number;
  elevated: boolean;
};
export type TCardVariantMap = Record<TCardVariant, TCardVariantProperty>;

export type TStyledCardProps = {
  type?: 'button';
  $elevated: boolean;
  $interactive: boolean;
};
