import { TCaptureContext } from './capture.types';
import { TErrorResponse } from './common';
import { TEngineAction } from './engine.types';
import { TAppearanceSettings } from './settings.types';

export type TPanelMode = 'panel' | 'note';

export type TPanelPayload = {
  mode: TPanelMode;
  action: TEngineAction;
  context: TCaptureContext;
  canSync: boolean;
};

export type TActionRequest = {
  action: TEngineAction;
  text?: string;
};

export type TToastPayload = {
  message: string;
  detail: string;
};

export type TWispBridge = {
  onPanelRender: (handler: (payload: TPanelPayload) => void) => () => void;
  onToastShow: (handler: (payload: TToastPayload) => void) => () => void;
  onToastHide: (handler: () => void) => () => void;
  runAction: (request: TActionRequest) => Promise<unknown>;
  ipcRequest: <TResult>(request: TIpcRequest) => Promise<TIpcResponse<TResult>>;
  onSessionExpired: (handler: () => void) => () => void;
  signOut: () => Promise<void>;
  focusInput: () => void;
  dismiss: () => void;
  getSettings: () => Promise<TAppearanceSettings>;
  setSettings: (patch: Partial<TAppearanceSettings>) => Promise<TAppearanceSettings>;
  onSettingsChanged: (handler: (settings: TAppearanceSettings) => void) => () => void;
};

export type TIpcRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type TIpcRequest = {
  method: TIpcRequestMethod;
  url: string;
  data?: object;
};

export type TIpcResponse<TResult> =
  { ok: true; data: TResult } | { ok: false; error: TErrorResponse };
