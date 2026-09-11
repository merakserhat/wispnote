import NoteKind from 'shared/enums/NoteKind';
import { TNote } from 'shared/types/note.types';
import { TNoteGroup } from 'shared/types/noteGroup.types';
import { TSource } from 'shared/types/source.types';

import { TThemePrimitives } from 'theme/theme.types';

export type TNotesFeedProps = {
  source?: TSource;
  noteGroup?: TNoteGroup;
};

export type TNoteKindFilter = NoteKind | 'ALL';

export type TNoteDayGroup = {
  label: string;
  notes: TNote[];
};

export type TSourceMap = Record<string, TSource>;

export type TToggleNoteHandler = (noteId: string) => void;

export type TNotesEmptyState = {
  title: string;
  hint: string;
};

export type TNotesTimelineProps = {
  notes: TNote[];
  sourceMap: TSourceMap;
  noteGroup?: TNoteGroup;
  openNoteId: string | null;
  isPending: boolean;
  isError: boolean;
  onToggleNote: TToggleNoteHandler;
};

export type TNoteDayGroupProps = {
  group: TNoteDayGroup;
  sourceMap: TSourceMap;
  noteGroup?: TNoteGroup;
  openNoteId: string | null;
  onToggleNote: TToggleNoteHandler;
};

export type TNoteRowProps = {
  note: TNote;
  source?: TSource;
  noteGroup?: TNoteGroup;
  isOpen: boolean;
  onToggle: TToggleNoteHandler;
};

export type TNoteDetailsProps = {
  note: TNote;
  source?: TSource;
};

export type TNoteDetailEntry = {
  label: string;
  value: string;
  mono?: boolean;
};

export type THighlightStyleProps = {
  $color: keyof TThemePrimitives;
};
