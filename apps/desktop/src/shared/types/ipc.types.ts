import type { AxiosRequestConfig } from 'axios';

import { TCaptureHudIntent, TCaptureHudState } from './captureHud.types';
import { TErrorResponse } from './common';
import { TAppearanceSettings } from './settings.types';

export type TWispBridge = {
  onHudState: (handler: (state: TCaptureHudState) => void) => () => void;
  sendHudIntent: (intent: TCaptureHudIntent) => void;
  ipcRequest: <TResult>(request: TIpcRequest) => Promise<TIpcResponse<TResult>>;
  onSessionExpired: (handler: () => void) => () => void;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<TIpcResponse<null>>;
  cancelGoogleSignIn: () => Promise<void>;
  getSettings: () => Promise<TAppearanceSettings>;
  setSettings: (patch: Partial<TAppearanceSettings>) => Promise<TAppearanceSettings>;
  onSettingsChanged: (handler: (settings: TAppearanceSettings) => void) => () => void;
};

export type TIpcRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type TIpcRequest = {
  method: TIpcRequestMethod;
  url: string;
  data?: object;
  config?: AxiosRequestConfig;
};

export type TIpcResponse<TResult> =
  { ok: true; data: TResult } | { ok: false; error: TErrorResponse };
