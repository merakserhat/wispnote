import { TPaginationRequestParams } from 'shared/types/common';
import { TNotesFilterParams } from 'shared/types/note.types';

const notesQueryKeys = {
  all: ['notes'] as const,
  list: (params: TPaginationRequestParams<TNotesFilterParams>) =>
    [...notesQueryKeys.all, 'list', params] as const,
  detail: (noteId: string) => [...notesQueryKeys.all, 'detail', noteId] as const,
};

export default notesQueryKeys;
