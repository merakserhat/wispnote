import { TEngineSettings } from 'shared/types/engine.types';

export const DEFAULT_ENGINE_SETTINGS: TEngineSettings = {
  triggers: {
    fn: 'show_panel',
    double_fn: 'quick_highlight',
    'fn+1': 'quick_note',
    'fn+2': 'sync_source',
    'fn+3': 'open_notes',
    'fn+4': 'none',
  },
  suppress_fn: true,
  fn_double_interval: 0.35,
  max_selection_chars: 20000,
  max_context_chars: 600,
  deep_search_selection: true,
};
