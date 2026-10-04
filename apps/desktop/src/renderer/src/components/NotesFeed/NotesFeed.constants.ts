import NoteKind from 'shared/enums/NoteKind';
import { TNotesFilterParams } from 'shared/types/note.types';

import { TSegmentedControlOption } from 'components/core/SegmentedControl';

import { TNoteKindFilter, TNotesEmptyState } from './NotesFeed.types';

export const NOTE_KIND_FILTER_ALL = 'ALL';

export const NOTE_KIND_FILTER_OPTIONS: Array<TSegmentedControlOption<TNoteKindFilter>> = [
  { label: 'All', value: NOTE_KIND_FILTER_ALL },
  { label: 'Highlights', value: NoteKind.HIGHLIGHT },
  { label: 'Notes', value: NoteKind.NOTE },
  { label: 'Imported', value: NoteKind.IMPORTED },
];

export const NOTES_FIRST_PAGE = 0;
export const NOTES_PAGE_SIZE = 100;
export const NOTES_SORT: Pick<TNotesFilterParams, 'sortBy' | 'isAscending'> = {
  sortBy: 'createdAt',
  isAscending: false,
};

export const SOURCE_LOOKUP_PAGE_SIZE = 100;

export const NOTE_TEXT_COLLAPSED_LINES = 3;
export const NOTE_TIME_COLUMN_WIDTH = 88;
export const NOTE_DETAIL_LABEL_WIDTH = 90;
export const NOTES_SEARCH_WIDTH = 260;

export const NOTES_EMPTY_STATE: TNotesEmptyState = {
  title: 'Nothing here yet.',
  hint: 'Select text anywhere and press Fn Fn.',
};

export const NOTE_GROUP_EMPTY_STATE: TNotesEmptyState = {
  title: 'Nothing in this group yet.',
  hint: 'Open a note and choose Add to group.',
};
