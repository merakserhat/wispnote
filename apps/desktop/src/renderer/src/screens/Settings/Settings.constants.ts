import { TColorScheme } from 'shared/types/settings.types';

import { TSegmentedControlOption } from 'components/core/SegmentedControl';

export const SETTINGS_PAGE_DESCRIPTION =
  'Appearance for now. Shortcuts, engine and account come later.';

export const APPEARANCE_DESCRIPTION = 'Light and dark are both taken from the palette.';

export const COLOR_SCHEME_OPTIONS: Array<TSegmentedControlOption<TColorScheme>> = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export const SWATCH_SIZE = 34;
