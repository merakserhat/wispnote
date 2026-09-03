import { TCaptureContext } from './capture.types';
import { TErrorResponse } from './common';
import { TEngineAction, TToastFrame } from './engine.types';

export type TPanelMode = 'panel' | 'note';

export type TPanelPayload = {
  mode: TPanelMode;
  action: TEngineAction;
  context: TCaptureContext;
  canSync: boolean;
  summary: string;
};

export type TActionRequest = {
  action: TEngineAction;
  text?: string;
};

export type TToastPayload = Pick<TToastFrame, 'message' | 'detail'>;

export type TWispBridge = {
  onPanelRender: (handler: (payload: TPanelPayload) => void) => () => void;
  onToastShow: (handler: (payload: TToastPayload) => void) => () => void;
  onToastHide: (handler: () => void) => () => void;
  runAction: (request: TActionRequest) => Promise<unknown>;
  ipcRequest: <TResult>(request: TIpcRequest) => Promise<TIpcResponse<TResult>>;
  onSessionExpired: (handler: () => void) => () => void;
  signOut: () => void;
  focusInput: () => void;
  dismiss: () => void;
};

export type TIpcRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type TIpcRequest = {
  method: TIpcRequestMethod;
  url: string;
  data?: object;
};

export type TIpcResponse<TResult> =
  { ok: true; data: TResult } | { ok: false; error: TErrorResponse };
