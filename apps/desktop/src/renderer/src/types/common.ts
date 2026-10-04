import { ReactNode } from 'react';

import { TErrorResponse } from 'shared/types/common';

export type TChildrenOnly = {
  children: ReactNode;
};

export type TQueryHookParams<TOptions = undefined> = {
  queryParams?: {
    enabled?: boolean;
    refetchInterval?: number;
    retry?: boolean;
  };
} & TQueryHookParamsOptions<TOptions>;

type TQueryHookParamsOptions<TOptions> = TOptions extends undefined
  ? { options?: TOptions }
  : { options: TOptions };

export type TMutationHookParams<TSuccess = unknown, TError = unknown, TParams = unknown> = {
  onSuccess?: (result?: TSuccess, params?: TParams) => void;
  onError?: (result?: TError, params?: TParams) => void;
};

export type TRequestError = TErrorResponse | undefined;
