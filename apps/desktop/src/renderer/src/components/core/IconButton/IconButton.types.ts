import type { ButtonProps as AntButtonProps } from 'antd';

import { TIconComponent } from 'components/Icons';
import { TButtonSize, TButtonVariant } from 'components/core/Button';

export type TIconButtonProps = {
  icon: TIconComponent;
  label?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  outline?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
};

export type TIconButtonVariantProperty = Required<Pick<AntButtonProps, 'color' | 'variant'>>;
export type TIconButtonVariantMap = Record<TButtonVariant, TIconButtonVariantProperty>;
