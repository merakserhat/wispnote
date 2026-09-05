import NoteKind from 'shared/enums/NoteKind';
import { TNote } from 'shared/types/note.types';
import { TSource } from 'shared/types/source.types';

import { TThemePrimitives } from 'theme/theme.types';

export type TNotesFeedProps = {
  source?: TSource;
};

export type TNoteKindFilter = NoteKind | 'ALL';

export type TNoteGroup = {
  label: string;
  notes: TNote[];
};

export type TSourceMap = Record<string, TSource>;

export type TToggleNoteHandler = (noteId: string) => void;

export type TNotesTimelineProps = {
  notes: TNote[];
  sourceMap: TSourceMap;
  openNoteId: string | null;
  isPending: boolean;
  isError: boolean;
  onToggleNote: TToggleNoteHandler;
};

export type TNoteGroupProps = {
  group: TNoteGroup;
  sourceMap: TSourceMap;
  openNoteId: string | null;
  onToggleNote: TToggleNoteHandler;
};

export type TNoteRowProps = {
  note: TNote;
  source?: TSource;
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
