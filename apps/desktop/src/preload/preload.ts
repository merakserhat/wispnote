import { contextBridge, ipcRenderer } from 'electron';

import { IPC_CHANNELS } from 'shared/constants/channels';
import {
  TActionRequest,
  TIpcRequest,
  TIpcResponse,
  TPanelPayload,
  TToastPayload,
  TWispBridge,
} from 'shared/types/ipc.types';
import { TAppearanceSettings } from 'shared/types/settings.types';

import { subscribe } from './preload.helpers';

const bridge: TWispBridge = {
  onPanelRender(handler) {
    return subscribe<TPanelPayload>(IPC_CHANNELS.panelRender, handler);
  },
  onToastShow(handler) {
    return subscribe<TToastPayload>(IPC_CHANNELS.toastShow, handler);
  },
  onToastHide(handler) {
    return subscribe<void>(IPC_CHANNELS.toastHide, handler);
  },
  onSessionExpired(handler) {
    return subscribe<void>(IPC_CHANNELS.sessionExpired, handler);
  },
  runAction(request: TActionRequest) {
    return ipcRenderer.invoke(IPC_CHANNELS.action, request);
  },
  ipcRequest<TResult>(request: TIpcRequest): Promise<TIpcResponse<TResult>> {
    return ipcRenderer.invoke(IPC_CHANNELS.apiRequest, request);
  },
  signOut() {
    return ipcRenderer.invoke(IPC_CHANNELS.signOut);
  },
  focusInput() {
    ipcRenderer.send(IPC_CHANNELS.focusInput);
  },
  dismiss() {
    ipcRenderer.send(IPC_CHANNELS.dismiss);
  },
  getSettings() {
    return ipcRenderer.invoke(IPC_CHANNELS.settingsGet);
  },
  setSettings(patch: Partial<TAppearanceSettings>) {
    return ipcRenderer.invoke(IPC_CHANNELS.settingsSet, patch);
  },
  onSettingsChanged(handler) {
    return subscribe<TAppearanceSettings>(IPC_CHANNELS.settingsChanged, handler);
  },
};

contextBridge.exposeInMainWorld('wisp', bridge);
