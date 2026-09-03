import { TIpcRequestMethod } from 'shared/types/ipc.types';

async function sendRequest<TResult>(
  method: TIpcRequestMethod,
  url: string,
  data?: object
): Promise<{ data: TResult }> {
  const response = await window.wisp.ipcRequest<TResult>({ method, url, data });

  if (!response.ok) {
    throw response.error;
  }

  return { data: response.data };
}

const Ipc = {
  get<TResult>(url: string) {
    return sendRequest<TResult>('GET', url);
  },
  post<TResult>(url: string, data?: object) {
    return sendRequest<TResult>('POST', url, data);
  },
  put<TResult>(url: string, data?: object) {
    return sendRequest<TResult>('PUT', url, data);
  },
  patch<TResult>(url: string, data: object) {
    return sendRequest<TResult>('PATCH', url, data);
  },
  delete<TResult>(url: string) {
    return sendRequest<TResult>('DELETE', url);
  },
};

export default Ipc;
