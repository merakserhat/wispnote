import type { AxiosRequestConfig } from 'axios';

import { TIpcRequestMethod } from 'shared/types/ipc.types';

async function sendRequest<TResult>(
  method: TIpcRequestMethod,
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<{ data: TResult }> {
  const response = await window.wisp.ipcRequest<TResult>({ method, url, data, config });

  if (!response.ok) {
    throw response.error;
  }

  return { data: response.data };
}

const Ipc = {
  get<TResult>(url: string, config?: AxiosRequestConfig) {
    return sendRequest<TResult>('GET', url, undefined, config);
  },
  post<TResult>(url: string, data?: object, config?: AxiosRequestConfig) {
    return sendRequest<TResult>('POST', url, data, config);
  },
  put<TResult>(url: string, data?: object, config?: AxiosRequestConfig) {
    return sendRequest<TResult>('PUT', url, data, config);
  },
  patch<TResult>(url: string, data: object) {
    return sendRequest<TResult>('PATCH', url, data);
  },
  delete<TResult>(url: string) {
    return sendRequest<TResult>('DELETE', url);
  },
};

export default Ipc;
