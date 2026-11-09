import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  TConfirmEmailRequestParams,
  TLoginRequestParams,
  TMember,
  TRegisterRequestParams,
  TRegisterResponse,
  TResendVerificationRequestParams,
  TResendVerificationResponse,
} from 'shared/types/auth.types';
import { TCommonResponse, TErrorResponse } from 'shared/types/common';

import { TMutationHookParams, TQueryHookParams } from 'types/common';

import {
  requestCancelGoogleSignIn,
  requestConfirmEmail,
  requestGoogleSignIn,
  requestLogin,
  requestMember,
  requestRegister,
  requestResendVerification,
  requestSignOut,
} from './auth.ipc';
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
}: TMutationHookParams<TRegisterResponse, TErrorResponse> = {}) {
  const {
    mutate: register,
    isPending,
    error,
  } = useMutation<TCommonResponse<TRegisterResponse>, TErrorResponse, TRegisterRequestParams>({
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

export function useConfirmEmail({
  onSuccess,
  onError,
}: TMutationHookParams<void, TErrorResponse> = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: confirmEmail,
    isPending,
    error,
  } = useMutation<void, TErrorResponse, TConfirmEmailRequestParams>({
    mutationFn: requestConfirmEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
      onSuccess?.();
    },
    onError: (requestError) => onError?.(requestError),
  });

  return {
    confirmEmail,
    isPending,
    error,
  };
}

export function useResendVerification({
  onSuccess,
  onError,
}: TMutationHookParams<TResendVerificationResponse, TErrorResponse> = {}) {
  const {
    mutate: resendVerification,
    isPending,
    error,
  } = useMutation<
    TCommonResponse<TResendVerificationResponse>,
    TErrorResponse,
    TResendVerificationRequestParams
  >({
    mutationFn: requestResendVerification,
    onSuccess: (response) => onSuccess?.(response.result),
    onError: (requestError) => onError?.(requestError),
  });

  return {
    resendVerification,
    isPending,
    error,
  };
}

export function useLogout({ onSuccess }: TMutationHookParams = {}) {
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation<void, TErrorResponse, void>({
    mutationFn: requestSignOut,
    onSettled: () => {
      queryClient.resetQueries();
      onSuccess?.();
    },
  });

  return {
    logout,
    isPending,
  };
}

export function useGoogleSignIn({
  onSuccess,
  onError,
}: TMutationHookParams<void, TErrorResponse> = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: signIn,
    isPending,
    error,
  } = useMutation<void, TErrorResponse, void>({
    mutationFn: requestGoogleSignIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
      onSuccess?.();
    },
    onError: (requestError) => onError?.(requestError),
  });

  return {
    signIn,
    cancel: requestCancelGoogleSignIn,
    isPending,
    error: error?.errorCode === 'GOOGLE_SIGN_IN_CANCELLED' ? null : error,
  };
}
