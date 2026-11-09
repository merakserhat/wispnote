import { AxiosResponse } from 'axios';

import { TOKEN_PAIR_ENDPOINTS } from 'shared/constants/apiEndpoint';
import { TErrorResponse } from 'shared/types/common';
import { TIpcRequest } from 'shared/types/ipc.types';

import Api from '../helpers/api';

export function sendApiRequest({
  method,
  url,
  data,
  config,
}: TIpcRequest): Promise<AxiosResponse<unknown>> {
  switch (method) {
    case 'GET':
      return Api.get<unknown>(url, config);

    case 'POST':
      return Api.post<unknown>(url, data, config);

    case 'PUT':
      return Api.put<unknown>(url, data, config);

    case 'PATCH':
      return Api.patch<unknown>(url, data ?? {});

    case 'DELETE':
      return Api.delete<unknown>(url);

    default:
      return Promise.reject(new Error(`unsupported method: ${method}`));
  }
}

export function toIpcData({ url }: TIpcRequest, response: AxiosResponse<unknown>): unknown {
  // INFO: (serhat) the token pair bodies stay in main, see storeTokensOnLogin.
  if (TOKEN_PAIR_ENDPOINTS.includes(url)) {
    return null;
  }

  return response.data;
}

export function toErrorResponse(error: unknown): TErrorResponse {
  const response = error as AxiosResponse<Partial<TErrorResponse>> | undefined;

  if (response?.status) {
    return {
      ...response.data,
      status: response.status,
      errorCode: response.data?.errorCode ?? null,
      errorMessage: response.data?.errorMessage ?? 'Something went wrong.',
    };
  }

  return {
    status: 0,
    errorCode: null,
    errorMessage: 'Could not reach the server.',
  };
}
