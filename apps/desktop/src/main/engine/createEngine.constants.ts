import { TEngineSettings } from 'shared/types/engine.types';

export const DEFAULT_ENGINE_SETTINGS: TEngineSettings = {
  triggers: {
    'ctrl+shift': 'show_panel',
    'ctrl+shift+shift': 'quick_highlight',
    'shift+ctrl': 'quick_note',
    'shift+ctrl+ctrl': 'none',
  },
  max_selection_chars: 20000,
  max_context_chars: 600,
  deep_search_selection: true,
};
