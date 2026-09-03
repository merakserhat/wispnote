import { AxiosResponse } from 'axios';

import API_ENDPOINT from 'shared/constants/apiEndpoint';
import { TErrorResponse } from 'shared/types/common';
import { TSaveResult } from 'shared/types/engine.types';
import { TIpcRequest } from 'shared/types/ipc.types';

import Api from '../helpers/api';
import { TRunActionParams } from './ipc.types';

export async function runAction({
  request,
  engine,
  panel,
  getContext,
}: TRunActionParams): Promise<unknown> {
  const { action, text } = request;

  // INFO: (serhat) never re-capture here - the engine captured this before any window appeared.
  const context = getContext();

  if (action === 'quick_note') {
    const result = await engine.request<TSaveResult>('save_note', { context, text });
    panel.hide();
    return result;
  }

  panel.hide();

  switch (action) {
    case 'quick_highlight':
      return engine.request<TSaveResult>('save_highlight', { context });

    case 'sync_source':
      return engine.request('sync_source', { context });

    case 'open_notes':
      return engine.request('list_notes', { limit: 20 });

    default:
      return null;
  }
}

export function sendApiRequest({
  method,
  url,
  data,
}: TIpcRequest): Promise<AxiosResponse<unknown>> {
  switch (method) {
    case 'GET':
      return Api.get<unknown>(url);

    case 'POST':
      return Api.post<unknown>(url, data);

    case 'PUT':
      return Api.put<unknown>(url, data);

    case 'PATCH':
      return Api.patch<unknown>(url, data ?? {});

    case 'DELETE':
      return Api.delete<unknown>(url);

    default:
      return Promise.reject(new Error(`unsupported method: ${method}`));
  }
}

export function toIpcData({ url }: TIpcRequest, response: AxiosResponse<unknown>): unknown {
  // INFO: (serhat) the login body carries the token pair - it stays in main.
  if (url === API_ENDPOINT.LOGIN) {
    return null;
  }

  return response.data;
}

export function toErrorResponse(error: unknown): TErrorResponse {
  const response = error as AxiosResponse<Partial<TErrorResponse>> | undefined;

  if (response?.status) {
    return {
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
