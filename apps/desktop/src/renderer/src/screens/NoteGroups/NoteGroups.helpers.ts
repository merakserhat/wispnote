import { TErrorResponse } from 'shared/types/common';
import { TNoteGroup } from 'shared/types/noteGroup.types';

import { NOTE_GROUP_CREATE_GENERIC_ERROR_MESSAGE } from './NoteGroups.constants';

export function formatNoteGroupMeta(noteCount: number): string {
  return `${noteCount} ${noteCount === 1 ? 'note' : 'notes'}`;
}

export function formatDuplicateTitleMessage(title: string): string {
  return `You already have a group called “${title.trim()}”.`;
}

export function isDuplicateNoteGroupTitle(groups: TNoteGroup[], title: string): boolean {
  const needle = title.trim().toLowerCase();

  return groups.some((group) => group.title.toLowerCase() === needle);
}

export function getCreateNoteGroupErrorMessage({
  errorCode,
  errorMessage,
}: TErrorResponse): string {
  return errorCode === 'GENERIC_ERROR' ? NOTE_GROUP_CREATE_GENERIC_ERROR_MESSAGE : errorMessage;
}

export function formatNoNoteGroupMatch(search: string): string {
  return `No group matches “${search}”.`;
}
