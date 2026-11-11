import { TKeycapSizeMap } from './Keycap.types';

export const KEYCAP_SIZE_MAP: TKeycapSizeMap = {
  small: {
    height: 16,
    px: 'xs',
    borderRadius: 4,
    borderBottomWidth: 1,
    textVariant: 'kbd',
    textColor: 'textSecondary',
  },
  medium: {
    height: 24,
    px: 's',
    borderRadius: 6,
    borderBottomWidth: 2,
    textVariant: 'keycap',
    textColor: 'textPrimary',
    backgroundColor: 'backgroundElevated',
  },
  large: {
    height: 32,
    px: 'sm',
    borderRadius: 8,
    borderBottomWidth: 2,
    textVariant: 'bodySubBold',
    textColor: 'textPrimary',
    backgroundColor: 'backgroundElevated',
  },
};
