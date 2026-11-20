import SourceKind from 'shared/enums/SourceKind';
import { TNote } from 'shared/types/note.types';
import { TNoteGroup } from 'shared/types/noteGroup.types';
import { TQuickPasteGroup, TQuickPasteNote } from 'shared/types/quickPaste.types';
import { TSource } from 'shared/types/source.types';

import { RECENT_GROUP_KEY, RECENT_GROUP_TITLE } from './createQuickPaste.constants';
import { TSourceMap } from './createQuickPaste.types';

export function toSourceMap(sources: TSource[]): TSourceMap {
  return Object.fromEntries(sources.map((source) => [source.id, source]));
}

export function toRecentGroup(noteCount: number): TQuickPasteGroup {
  return { key: RECENT_GROUP_KEY, title: RECENT_GROUP_TITLE, noteCount, recent: true };
}

export function toPasteGroup(group: TNoteGroup): TQuickPasteGroup {
  return { key: group.id, title: group.title, noteCount: group.noteCount, recent: false };
}

function toCaption(note: TNote, source?: TSource): string {
  const title = source?.title || source?.appName || note.windowTitle || '';
  const location = note.pageNumber ? `p. ${note.pageNumber}` : (note.section ?? '');

  return [title, location].filter(Boolean).join(' · ');
}

// INFO: (serhat) a note with both a highlight and a typed note shows and pastes its highlight.
export function toPasteNote(note: TNote, sources: TSourceMap): TQuickPasteNote | null {
  const highlight = note.selectedText?.trim() ?? '';
  const text = highlight || (note.userNote?.trim() ?? '');
  if (!text) {
    return null;
  }

  const source = sources[note.sourceId];

  return {
    id: note.id,
    text,
    typed: !highlight,
    sourceKind: source?.kind ?? SourceKind.APP,
    caption: toCaption(note, source),
  };
}

export function toPasteNotes(notes: TNote[], sources: TSourceMap): TQuickPasteNote[] {
  return notes
    .map((note) => toPasteNote(note, sources))
    .filter((note): note is TQuickPasteNote => note !== null);
}
