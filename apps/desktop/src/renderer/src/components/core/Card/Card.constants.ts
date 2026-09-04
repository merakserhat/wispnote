import { TCardVariantMap } from './Card.types';

export const CARD_VARIANT_MAP: TCardVariantMap = {
  flat: { backgroundColor: 'backgroundTertiary', elevated: false },
  outlined: {
    backgroundColor: 'backgroundTertiary',
    borderColor: 'borderDivider',
    borderWidth: 1,
    elevated: false,
  },
  elevated: { backgroundColor: 'backgroundTertiary', elevated: true },
};

export const CARD_BORDER_RADIUS = 12;

export const CARD_ELEVATION_SHADOW = '0 8px 30px rgba(0, 0, 0, 0.1)';
