import { AxiosRequestConfig } from 'axios';

import { ApiClient } from '../../configs/requestConfig';

const Api = {
  get<TResult>(url: string, config?: AxiosRequestConfig) {
    return ApiClient.get<TResult>(url, config);
  },
  post<TResult>(url: string, data?: object, config?: AxiosRequestConfig) {
    return ApiClient.post<TResult>(url, data, config);
  },
  put<TResult>(url: string, data?: object, config?: AxiosRequestConfig) {
    return ApiClient.put<TResult>(url, data, config);
  },
  patch<TResult>(url: string, data: object) {
    return ApiClient.patch<TResult>(url, data);
  },
  delete<TResult>(url: string) {
    return ApiClient.delete<TResult>(url);
  },
};

export default Api;
