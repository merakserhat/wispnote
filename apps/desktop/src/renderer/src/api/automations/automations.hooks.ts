import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  TAutomation,
  TAutomationDetailRequestParams,
  TAutomationListRequestParams,
  TAutomationListResponse,
  TAutomationSuggestion,
  TCreateAutomationRequestParams,
  TToggleAutomationRequestParams,
} from 'shared/types/automation.types';
import { TCommonResponse, TErrorResponse } from 'shared/types/common';

import { TMutationHookParams, TQueryHookParams } from 'types/common';

import {
  requestAutomations,
  requestAutomationSuggestions,
  requestCreateAutomation,
  requestDeleteAutomation,
  requestToggleAutomation,
} from './automations.ipc';
import automationsQueryKeys from './automations.queries';

export function useGetAutomations({
  options,
  queryParams,
}: TQueryHookParams<TAutomationListRequestParams>) {
  const { data, isLoading, isPending, isError, refetch } = useQuery<TAutomationListResponse>({
    queryKey: automationsQueryKeys.list(options),
    queryFn: () => requestAutomations(options),
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

export function useGetAutomationSuggestions({ queryParams }: TQueryHookParams = {}) {
  const { data, isLoading, isPending, isError } = useQuery<
    TCommonResponse<TAutomationSuggestion[]>
  >({
    queryKey: automationsQueryKeys.suggestions(),
    queryFn: requestAutomationSuggestions,
    ...queryParams,
  });

  return {
    data: data?.result,
    isLoading,
    isPending,
    isError,
  };
}

export function useCreateAutomation({
  onSuccess,
  onError,
}: TMutationHookParams<TAutomation, TErrorResponse> = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: createAutomation,
    isPending,
    error,
  } = useMutation<TCommonResponse<TAutomation>, TErrorResponse, TCreateAutomationRequestParams>({
    mutationFn: requestCreateAutomation,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: automationsQueryKeys.all });
      onSuccess?.(response.result);
    },
    onError: (requestError) => onError?.(requestError),
  });

  return {
    createAutomation,
    isPending,
    error,
  };
}

export function useToggleAutomation({
  onSuccess,
  onError,
}: TMutationHookParams<TAutomation, TErrorResponse> = {}) {
  const queryClient = useQueryClient();

  const { mutate: toggleAutomation, isPending } = useMutation<
    TCommonResponse<TAutomation>,
    TErrorResponse,
    TToggleAutomationRequestParams
  >({
    mutationFn: requestToggleAutomation,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: automationsQueryKeys.all });
      onSuccess?.(response.result);
    },
    onError: (requestError) => onError?.(requestError),
  });

  return {
    toggleAutomation,
    isPending,
  };
}

export function useDeleteAutomation({
  onSuccess,
  onError,
}: TMutationHookParams<void, TErrorResponse> = {}) {
  const queryClient = useQueryClient();

  const { mutate: deleteAutomation, isPending } = useMutation<
    void,
    TErrorResponse,
    TAutomationDetailRequestParams
  >({
    mutationFn: requestDeleteAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationsQueryKeys.all });
      onSuccess?.();
    },
    onError: (requestError) => onError?.(requestError),
  });

  return {
    deleteAutomation,
    isPending,
  };
}
