import { contextBridge, ipcRenderer } from 'electron';

import { IPC_CHANNELS } from 'shared/constants/channels';
import {
  TActionRequest,
  TIpcRequest,
  TPanelPayload,
  TToastPayload,
  TWispBridge,
} from 'shared/types/ipc.types';

/**
 * The only surface the renderer gets.
 *
 * Every subscriber returns its own unsubscribe, so a React effect can clean up
 * without `removeAllListeners` wiping out a sibling's handler.
 */
const subscribe = <TPayload>(
  channel: string,
  handler: (payload: TPayload) => void
): (() => void) => {
  const listener = (_event: Electron.IpcRendererEvent, payload: TPayload): void => handler(payload);
  ipcRenderer.on(channel, listener);
  return () => {
    ipcRenderer.removeListener(channel, listener);
  };
};

const bridge: TWispBridge = {
  onPanelRender: (handler) => subscribe<TPanelPayload>(IPC_CHANNELS.panelRender, handler),
  onToastShow: (handler) => subscribe<TToastPayload>(IPC_CHANNELS.toastShow, handler),
  onToastHide: (handler) => subscribe<void>(IPC_CHANNELS.toastHide, () => handler()),
  runAction: (request: TActionRequest) => ipcRenderer.invoke(IPC_CHANNELS.action, request),
  ipcRequest: (request: TIpcRequest) => ipcRenderer.invoke(IPC_CHANNELS.apiRequest, request),
  onSessionExpired: (handler) => subscribe<void>(IPC_CHANNELS.sessionExpired, () => handler()),
  signOut: () => ipcRenderer.invoke(IPC_CHANNELS.signOut),
  focusInput: () => ipcRenderer.send(IPC_CHANNELS.focusInput),
  dismiss: () => ipcRenderer.send(IPC_CHANNELS.dismiss),
};

contextBridge.exposeInMainWorld('wisp', bridge);
