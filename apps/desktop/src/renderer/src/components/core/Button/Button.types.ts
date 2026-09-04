import type { ButtonProps as AntButtonProps } from 'antd';

import { TIconComponent } from 'components/Icons/Icon.types';

export type TButtonProps = Pick<AntButtonProps, 'htmlType'> & {
  label: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  leftIcon?: TIconComponent;
  rightIcon?: TIconComponent;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  onPress?: () => void;
  className?: string;
};

export type TButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'error';
export type TButtonSize = 'small' | 'medium' | 'large';

export type TButtonVariantProperty = Required<Pick<AntButtonProps, 'color' | 'variant'>>;
export type TButtonVariantMap = Record<TButtonVariant, TButtonVariantProperty>;

export type TButtonSizeProperty = {
  antdSize: AntButtonProps['size'];
  iconSize: number;
};
export type TButtonSizeMap = Record<TButtonSize, TButtonSizeProperty>;
