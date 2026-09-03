import API_ENDPOINT from 'shared/constants/apiEndpoint';
import normalizeUrl from 'shared/helpers/normalizeUrl';
import { TCommonResponse, TPaginatedResponse, TPaginationRequestParams } from 'shared/types/common';

import Api from '../../helpers/api';
import {
  TCreateNoteRequestParams,
  TNote,
  TNoteDetailRequestParams,
  TNotesFilterParams,
} from './notes.types';

export async function requestCreateNote(
  params: TCreateNoteRequestParams
): Promise<TCommonResponse<TNote>> {
  const response = await Api.post<TCommonResponse<TNote>>(API_ENDPOINT.NOTES, params);
  return response.data;
}

export async function requestNotes({
  page,
  size = 20,
  ...filterParams
}: TPaginationRequestParams<TNotesFilterParams>): Promise<TPaginatedResponse<TNote>> {
  const response = await Api.get<TPaginatedResponse<TNote>>(
    normalizeUrl(API_ENDPOINT.NOTES, {
      queryParams: { page, size, ...filterParams },
    })
  );
  return response.data;
}

export async function requestNoteDetail({
  noteId,
}: TNoteDetailRequestParams): Promise<TCommonResponse<TNote>> {
  const response = await Api.get<TCommonResponse<TNote>>(
    normalizeUrl(API_ENDPOINT.NOTE_DETAIL, { pathVariables: { noteId } })
  );
  return response.data;
}

export async function requestDeleteNote({ noteId }: TNoteDetailRequestParams): Promise<void> {
  await Api.delete<void>(normalizeUrl(API_ENDPOINT.NOTE_DETAIL, { pathVariables: { noteId } }));
}
