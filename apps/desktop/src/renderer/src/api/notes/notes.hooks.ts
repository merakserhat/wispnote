import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { TCommonResponse, TPaginatedResponse, TPaginationRequestParams } from 'shared/types/common';
import { TNote, TNoteDetailRequestParams, TNotesFilterParams } from 'shared/types/note.types';

import { TMutationHookParams, TQueryHookParams } from 'types/common';

import { requestCreateNote, requestDeleteNote, requestNoteDetail, requestNotes } from './notes.ipc';
import notesQueryKeys from './notes.queries';

export function useGetNotes({
  options,
  queryParams,
}: TQueryHookParams<TPaginationRequestParams<TNotesFilterParams>>) {
  const { data, isLoading, isPending, isError, refetch } = useQuery<TPaginatedResponse<TNote>>({
    queryKey: notesQueryKeys.list(options),
    queryFn: () => requestNotes(options),
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

export function useGetNoteDetail({
  options,
  queryParams,
}: TQueryHookParams<TNoteDetailRequestParams>) {
  const { data, isLoading, isError } = useQuery<TCommonResponse<TNote>>({
    queryKey: notesQueryKeys.detail(options.noteId),
    queryFn: () => requestNoteDetail(options),
    ...queryParams,
  });

  return {
    data: data?.result,
    isLoading,
    isError,
  };
}

export function useCreateNote({ onSuccess }: TMutationHookParams<TNote> = {}) {
  const queryClient = useQueryClient();

  const { mutate: createNote, isPending } = useMutation({
    mutationFn: requestCreateNote,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: notesQueryKeys.all });
      onSuccess?.(response.result);
    },
  });

  return {
    createNote,
    isPending,
  };
}

export function useDeleteNote({ onSuccess }: TMutationHookParams = {}) {
  const queryClient = useQueryClient();

  const { mutate: deleteNote, isPending } = useMutation({
    mutationFn: requestDeleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKeys.all });
      onSuccess?.();
    },
  });

  return {
    deleteNote,
    isPending,
  };
}
