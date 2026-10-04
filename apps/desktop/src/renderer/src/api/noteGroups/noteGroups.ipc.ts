import API_ENDPOINT from 'shared/constants/apiEndpoint';
import normalizeUrl from 'shared/helpers/normalizeUrl';
import { TCommonResponse } from 'shared/types/common';
import {
  TCreateNoteGroupRequestParams,
  TNoteGroup,
  TNoteGroupDetailRequestParams,
  TNoteGroupMembershipRequestParams,
  TNoteGroupsFilterParams,
} from 'shared/types/noteGroup.types';

import Ipc from 'helpers/ipc';

export async function requestNoteGroups(
  filterParams: TNoteGroupsFilterParams
): Promise<TCommonResponse<TNoteGroup[]>> {
  const response = await Ipc.get<TCommonResponse<TNoteGroup[]>>(
    normalizeUrl(API_ENDPOINT.NOTE_GROUPS, { queryParams: filterParams })
  );
  return response.data;
}

export async function requestNoteGroupDetail({
  noteGroupId,
}: TNoteGroupDetailRequestParams): Promise<TCommonResponse<TNoteGroup>> {
  const response = await Ipc.get<TCommonResponse<TNoteGroup>>(
    normalizeUrl(API_ENDPOINT.NOTE_GROUP_DETAIL, { pathVariables: { noteGroupId } })
  );
  return response.data;
}

export async function requestCreateNoteGroup(
  params: TCreateNoteGroupRequestParams
): Promise<TCommonResponse<TNoteGroup>> {
  const response = await Ipc.post<TCommonResponse<TNoteGroup>>(API_ENDPOINT.NOTE_GROUPS, params);
  return response.data;
}

export async function requestDeleteNoteGroup({
  noteGroupId,
}: TNoteGroupDetailRequestParams): Promise<void> {
  await Ipc.delete<void>(
    normalizeUrl(API_ENDPOINT.NOTE_GROUP_DETAIL, { pathVariables: { noteGroupId } })
  );
}

export async function requestAddNoteToGroup({
  noteGroupId,
  noteId,
}: TNoteGroupMembershipRequestParams): Promise<void> {
  await Ipc.post<void>(
    normalizeUrl(API_ENDPOINT.NOTE_GROUP_NOTES, { pathVariables: { noteGroupId } }),
    { noteId }
  );
}

export async function requestRemoveNoteFromGroup({
  noteGroupId,
  noteId,
}: TNoteGroupMembershipRequestParams): Promise<void> {
  await Ipc.delete<void>(
    normalizeUrl(API_ENDPOINT.NOTE_GROUP_NOTE_DETAIL, { pathVariables: { noteGroupId, noteId } })
  );
}
