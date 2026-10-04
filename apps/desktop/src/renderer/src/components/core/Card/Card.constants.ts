import { TCardVariantMap } from './Card.types';

export const CARD_VARIANT_MAP: TCardVariantMap = {
  flat: { backgroundColor: 'backgroundElevated', borderWidth: 0, elevated: false },
  outlined: {
    backgroundColor: 'backgroundElevated',
    borderColor: 'borderDivider',
    borderWidth: 1,
    elevated: false,
  },
  elevated: { backgroundColor: 'backgroundElevated', borderWidth: 0, elevated: true },
};

export const CARD_BORDER_RADIUS = 12;

export const CARD_ELEVATION_SHADOW = '0 8px 30px rgba(0, 0, 0, 0.1)';
export const CARD_HOVER_SHADOW = '0 12px 36px rgba(0, 0, 0, 0.14)';
export const CARD_TRANSITION = '150ms ease';
