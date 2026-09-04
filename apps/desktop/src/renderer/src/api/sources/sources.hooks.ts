import { useQuery } from '@tanstack/react-query';

import { TPaginatedResponse } from 'shared/types/common';
import { TSource, TSourceListRequestParams } from 'shared/types/source.types';

import { TQueryHookParams } from 'types/common';

import { requestSources } from './sources.ipc';
import sourcesQueryKeys from './sources.queries';

export function useGetSources({
  options,
  queryParams,
}: TQueryHookParams<TSourceListRequestParams>) {
  const { data, isLoading, isPending, isError, refetch } = useQuery<TPaginatedResponse<TSource>>({
    queryKey: sourcesQueryKeys.list(options),
    queryFn: () => requestSources(options),
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
