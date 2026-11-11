import { TColorScheme } from 'shared/types/settings.types';

import { TSegmentedControlOption } from 'components/core/SegmentedControl';

import { TShortcut, TShortcutKey } from './Settings.types';

export const SETTINGS_PAGE_DESCRIPTION = 'Shortcuts and appearance. Engine and account come later.';

export const APPEARANCE_DESCRIPTION = 'Light and dark are both taken from the palette.';

export const COLOR_SCHEME_OPTIONS: Array<TSegmentedControlOption<TColorScheme>> = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export const SWATCH_SIZE = 34;

const CONTROL_KEY: TShortcutKey = { glyph: '⌃', label: 'control' };
const SHIFT_KEY: TShortcutKey = { glyph: '⇧', label: 'shift' };

export const SHORTCUTS: TShortcut[] = [
  {
    id: 'show_panel',
    action: 'Quick note',
    description: 'Opens the panel with the note field ready to type.',
    hold: CONTROL_KEY,
    tap: SHIFT_KEY,
    isTwice: false,
  },
  {
    id: 'quick_highlight',
    action: 'Quick highlight',
    description: 'Saves the selection straight away. No window opens.',
    hold: CONTROL_KEY,
    tap: SHIFT_KEY,
    isTwice: true,
  },
];
