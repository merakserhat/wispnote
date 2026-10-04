import API_ENDPOINT from 'shared/constants/apiEndpoint';
import normalizeUrl from 'shared/helpers/normalizeUrl';
import { TPaginatedResponse } from 'shared/types/common';
import { TSource, TSourceListRequestParams } from 'shared/types/source.types';

import Api from '../../helpers/api';

export async function requestSources({
  page,
  size = 20,
  ...filterParams
}: TSourceListRequestParams): Promise<TPaginatedResponse<TSource>> {
  const response = await Api.get<TPaginatedResponse<TSource>>(
    normalizeUrl(API_ENDPOINT.SOURCES, {
      queryParams: { page, size, ...filterParams },
    })
  );
  return response.data;
}
