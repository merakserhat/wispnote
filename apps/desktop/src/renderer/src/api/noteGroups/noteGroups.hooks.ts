import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { TCommonResponse, TErrorResponse } from 'shared/types/common';
import {
  TCreateNoteGroupRequestParams,
  TNoteGroup,
  TNoteGroupDetailRequestParams,
  TNoteGroupMembershipRequestParams,
  TNoteGroupsFilterParams,
} from 'shared/types/noteGroup.types';

import { notesQueryKeys } from 'api/notes';
import { TMutationHookParams, TQueryHookParams } from 'types/common';

import {
  requestAddNoteToGroup,
  requestCreateNoteGroup,
  requestDeleteNoteGroup,
  requestNoteGroupDetail,
  requestNoteGroups,
  requestRemoveNoteFromGroup,
} from './noteGroups.ipc';
import noteGroupsQueryKeys from './noteGroups.queries';

export function useGetNoteGroups({
  options,
  queryParams,
}: TQueryHookParams<TNoteGroupsFilterParams>) {
  const { data, isLoading, isPending, isError, refetch } = useQuery<TCommonResponse<TNoteGroup[]>>({
    queryKey: noteGroupsQueryKeys.list(options),
    queryFn: () => requestNoteGroups(options),
    ...queryParams,
  });

  return {
    data: data?.result,
    isLoading,
    isPending,
    isError,
    refetch,
  };
}

export function useGetNoteGroupDetail({
  options,
  queryParams,
}: TQueryHookParams<TNoteGroupDetailRequestParams>) {
  const { data, isLoading, isError } = useQuery<TCommonResponse<TNoteGroup>>({
    queryKey: noteGroupsQueryKeys.detail(options.noteGroupId),
    queryFn: () => requestNoteGroupDetail(options),
    ...queryParams,
  });

  return {
    data: data?.result,
    isLoading,
    isError,
  };
}

export function useCreateNoteGroup({
  onSuccess,
  onError,
}: TMutationHookParams<TNoteGroup, TErrorResponse> = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: createNoteGroup,
    mutateAsync: createNoteGroupAsync,
    isPending,
    error,
  } = useMutation<TCommonResponse<TNoteGroup>, TErrorResponse, TCreateNoteGroupRequestParams>({
    mutationFn: requestCreateNoteGroup,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: noteGroupsQueryKeys.all });
      onSuccess?.(response.result);
    },
    onError: (requestError) => onError?.(requestError),
  });

  return {
    createNoteGroup,
    createNoteGroupAsync,
    isPending,
    error,
  };
}

export function useDeleteNoteGroup({
  onSuccess,
  onError,
}: TMutationHookParams<void, TErrorResponse> = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: deleteNoteGroup,
    isPending,
    error,
  } = useMutation<void, TErrorResponse, TNoteGroupDetailRequestParams>({
    mutationFn: requestDeleteNoteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteGroupsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: notesQueryKeys.all });
      onSuccess?.();
    },
    onError: (requestError) => onError?.(requestError),
  });

  return {
    deleteNoteGroup,
    isPending,
    error,
  };
}

export function useAddNoteToGroup({
  onSuccess,
  onError,
}: TMutationHookParams<void, TErrorResponse> = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: addNoteToGroup,
    isPending,
    error,
  } = useMutation<void, TErrorResponse, TNoteGroupMembershipRequestParams>({
    mutationFn: requestAddNoteToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteGroupsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: notesQueryKeys.all });
      onSuccess?.();
    },
    onError: (requestError) => onError?.(requestError),
  });

  return {
    addNoteToGroup,
    isPending,
    error,
  };
}

export function useRemoveNoteFromGroup({
  onSuccess,
  onError,
}: TMutationHookParams<void, TErrorResponse> = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: removeNoteFromGroup,
    isPending,
    error,
  } = useMutation<void, TErrorResponse, TNoteGroupMembershipRequestParams>({
    mutationFn: requestRemoveNoteFromGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteGroupsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: notesQueryKeys.all });
      onSuccess?.();
    },
    onError: (requestError) => onError?.(requestError),
  });

  return {
    removeNoteFromGroup,
    isPending,
    error,
  };
}
