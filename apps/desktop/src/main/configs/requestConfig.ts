import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import API_ENDPOINT from 'shared/constants/apiEndpoint';
import { TTokenResponse } from 'shared/types/auth.types';
import { TCommonResponse } from 'shared/types/common';

import { BASE_API_URL } from '../constants/environment';
import { log } from '../helpers';
import storage, { STORAGE_KEYS } from '../helpers/storage';

type TRetriableRequestConfig = InternalAxiosRequestConfig & { alreadyRetried?: boolean };

const sessionExpiryListeners = new Set<() => void>();

let refreshRequest: Promise<string | null> | null = null;

export const ApiClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function requestNewTokens(refreshToken: string): Promise<string | null> {
  try {
    const response = await axios.post<TCommonResponse<TTokenResponse>>(
      `${BASE_API_URL}${API_ENDPOINT.REFRESH_TOKEN}`,
      { token: refreshToken }
    );

    storage.writeStorageFromKeys({
      [STORAGE_KEYS.ACCESS_TOKEN]: response.data.result.accessToken,
      [STORAGE_KEYS.REFRESH_TOKEN]: response.data.result.refreshToken,
    });

    log('auth', 'tokens rotated');
    return response.data.result.accessToken;
  } catch {
    log('auth', 'refresh rejected, signing out');
    storage.removeTokens();
    sessionExpiryListeners.forEach((listener) => listener());
    return null;
  }
}

function refreshTokens(refreshToken: string): Promise<string | null> {
  if (!refreshRequest) {
    refreshRequest = requestNewTokens(refreshToken).finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
}

ApiClient.interceptors.request.use(
  (request) => {
    const accessToken = storage.readStorage(STORAGE_KEYS.ACCESS_TOKEN);

    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

async function refreshOnUnauthorized(error: AxiosError) {
  const originalRequest = error?.config as TRetriableRequestConfig | undefined;
  const refreshToken = storage.readStorage(STORAGE_KEYS.REFRESH_TOKEN);

  if (error?.response?.status !== 401 || !refreshToken || !originalRequest) {
    return Promise.reject(error?.response ?? error);
  }

  if (originalRequest.alreadyRetried) {
    return Promise.reject(error?.response ?? error);
  }

  const accessToken = await refreshTokens(refreshToken);

  if (!accessToken) {
    return Promise.reject(error?.response ?? error);
  }

  originalRequest.alreadyRetried = true;
  originalRequest.headers.Authorization = `Bearer ${accessToken}`;

  return ApiClient(originalRequest);
}

function storeTokensOnLogin(response: AxiosResponse): AxiosResponse {
  if (response.config.url === API_ENDPOINT.LOGIN) {
    const { accessToken, refreshToken } = (response.data as TCommonResponse<TTokenResponse>).result;

    storage.writeStorageFromKeys({
      [STORAGE_KEYS.ACCESS_TOKEN]: accessToken,
      [STORAGE_KEYS.REFRESH_TOKEN]: refreshToken,
    });
  }

  return response;
}

ApiClient.interceptors.response.use(storeTokensOnLogin, refreshOnUnauthorized);

export function onSessionExpired(listener: () => void): () => void {
  sessionExpiryListeners.add(listener);

  return () => {
    sessionExpiryListeners.delete(listener);
  };
}
