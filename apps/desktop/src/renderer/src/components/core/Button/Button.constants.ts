import { TButtonSizeMap, TButtonVariantMap } from './Button.types';

export const BUTTON_VARIANT_MAP: TButtonVariantMap = {
  primary: { color: 'primary', variant: 'solid' },
  secondary: { color: 'default', variant: 'outlined' },
  ghost: { color: 'default', variant: 'filled' },
  success: { color: 'green', variant: 'filled' },
  error: { color: 'danger', variant: 'filled' },
};

export const BUTTON_SIZE_MAP: TButtonSizeMap = {
  small: { antdSize: 'small', iconSize: 14 },
  medium: { antdSize: 'middle', iconSize: 16 },
  large: { antdSize: 'large', iconSize: 18 },
};
