import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { TLoginRequestParams, TMember, TRegisterRequestParams } from 'shared/types/auth.types';
import { TCommonResponse, TErrorResponse } from 'shared/types/common';

import { TMutationHookParams, TQueryHookParams } from 'types/common';

import { requestLogin, requestMember, requestRegister } from './auth.ipc';
import authQueryKeys from './auth.queries';

export function useGetMember({ queryParams }: TQueryHookParams = {}) {
  const { data, isLoading, isPending, isError, refetch } = useQuery<TCommonResponse<TMember>>({
    queryKey: authQueryKeys.member(),
    queryFn: requestMember,
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

export function useLogin({ onSuccess, onError }: TMutationHookParams<void, TErrorResponse> = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation<void, TErrorResponse, TLoginRequestParams>({
    mutationFn: requestLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
      onSuccess?.();
    },
    onError: (requestError) => onError?.(requestError),
  });

  return {
    login,
    isPending,
    error,
  };
}

export function useRegister({
  onSuccess,
  onError,
}: TMutationHookParams<TMember, TErrorResponse> = {}) {
  const {
    mutate: register,
    isPending,
    error,
  } = useMutation<TCommonResponse<TMember>, TErrorResponse, TRegisterRequestParams>({
    mutationFn: requestRegister,
    onSuccess: (response) => onSuccess?.(response.result),
    onError: (requestError) => onError?.(requestError),
  });

  return {
    register,
    isPending,
    error,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();

  function logout() {
    window.wisp.signOut();
    queryClient.clear();
  }

  return { logout };
}
