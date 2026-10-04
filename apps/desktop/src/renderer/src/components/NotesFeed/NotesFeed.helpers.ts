import SourceKind from 'shared/enums/SourceKind';
import { TNote } from 'shared/types/note.types';
import { TNoteGroup } from 'shared/types/noteGroup.types';
import { TSource } from 'shared/types/source.types';

import { formatDayLabel } from 'helpers/date';

import { NOTE_GROUP_EMPTY_STATE, NOTES_EMPTY_STATE } from './NotesFeed.constants';
import { TNoteDayGroup, TNoteDetailEntry, TNotesEmptyState } from './NotesFeed.types';

export function groupNotesByDay(notes: TNote[]): TNoteDayGroup[] {
  return notes.reduce<TNoteDayGroup[]>((groups, note) => {
    const label = formatDayLabel(note.createdAt);
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.label === label) {
      lastGroup.notes.push(note);
    } else {
      groups.push({ label, notes: [note] });
    }

    return groups;
  }, []);
}

export function formatNoteLocation({ pageNumber, location, section }: TNote): string {
  const parts: string[] = [];
  const lineNumber = location?.lineNumber;

  if (pageNumber) {
    parts.push(`p. ${pageNumber}`);
  }

  if (typeof lineNumber === 'number') {
    parts.push(`line ${lineNumber}`);
  }

  if (section) {
    parts.push(section);
  }

  return parts.join(' · ');
}

export function getNoteDetailEntries(note: TNote, source?: TSource): TNoteDetailEntry[] {
  const entries: TNoteDetailEntry[] = [];

  if (source?.url) {
    entries.push({ label: 'URL', value: source.url, mono: true });
  }

  if (source?.filePath) {
    entries.push({ label: 'File', value: source.filePath, mono: true });
  }

  if (source?.kind === SourceKind.MAIL && source.externalId) {
    entries.push({ label: 'Message', value: source.externalId, mono: true });
  }

  if (source?.bundleId) {
    entries.push({ label: 'App', value: source.bundleId, mono: true });
  }

  if (note.pageNumber) {
    const total = source?.pageCount ? ` of ${source.pageCount}` : '';
    entries.push({ label: 'Page', value: `${note.pageNumber}${total}` });
  }

  if (note.section) {
    entries.push({ label: 'Section', value: note.section });
  }

  entries.push({ label: 'Window', value: note.windowTitle || '—' });
  entries.push({ label: 'Captured', value: new Date(note.createdAt).toLocaleString() });

  return entries;
}

export function getNotesEmptyState(noteGroup?: TNoteGroup): TNotesEmptyState {
  return noteGroup ? NOTE_GROUP_EMPTY_STATE : NOTES_EMPTY_STATE;
}
