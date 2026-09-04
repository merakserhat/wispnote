import { BUTTON_VARIANT_MAP } from 'components/core/Button/Button.constants';

import { TIconButtonVariantMap, TIconButtonVariantProperty } from './IconButton.types';

export const ICON_BUTTON_VARIANT_MAP: TIconButtonVariantMap = {
  ...BUTTON_VARIANT_MAP,
  secondary: { color: 'default', variant: 'text' },
};

export const ICON_BUTTON_OUTLINE_VARIANT: TIconButtonVariantProperty = {
  color: 'default',
  variant: 'outlined',
};
