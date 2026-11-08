import { AxiosResponse } from 'axios';

import API_ENDPOINT from 'shared/constants/apiEndpoint';
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

const TOKEN_PAIR_URLS: string[] = [API_ENDPOINT.LOGIN, API_ENDPOINT.EMAIL_VERIFICATION_CONFIRM];

export function toIpcData({ url }: TIpcRequest, response: AxiosResponse<unknown>): unknown {
  // INFO: (serhat) the login and confirm bodies carry the token pair - it stays in main.
  if (TOKEN_PAIR_URLS.includes(url)) {
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
