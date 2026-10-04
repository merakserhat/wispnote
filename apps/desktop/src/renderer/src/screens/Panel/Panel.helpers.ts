import { TCaptureContext } from 'shared/types/capture.types';

import { TPanelAction } from './Panel.types';

export function buildActions(context: TCaptureContext, canSync: boolean): TPanelAction[] {
  return [
    {
      action: 'quick_highlight',
      label: 'Save highlight',
      primary: true,
      disabled: !context.selectedText.trim(),
    },
    { action: 'quick_note', label: 'Quick note…' },
    { action: 'sync_source', label: 'Sync PDF', disabled: !canSync },
    { action: 'open_notes', label: 'Open notes' },
  ];
}

export function formatLocation(context: TCaptureContext): string {
  return [
    context.pageNumber ? `p. ${context.pageNumber}` : '',
    context.lineNumber ? `line ${context.lineNumber}` : '',
    context.section ?? '',
  ]
    .filter(Boolean)
    .join(' · ');
}

export function formatOrigin(context: TCaptureContext): string {
  return context.url ?? context.filePath ?? '';
}

export function formatSelection(context: TCaptureContext): string {
  return context.selectedText.trim();
}
