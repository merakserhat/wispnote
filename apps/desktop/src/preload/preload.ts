import { contextBridge, ipcRenderer } from 'electron';

import { IPC_CHANNELS } from 'shared/constants/channels';
import { TCaptureHudIntent, TCaptureHudState } from 'shared/types/captureHud.types';
import { TIpcRequest, TIpcResponse, TWispBridge } from 'shared/types/ipc.types';
import { TAppearanceSettings } from 'shared/types/settings.types';

import { subscribe } from './preload.helpers';

const bridge: TWispBridge = {
  onHudState(handler) {
    return subscribe<TCaptureHudState>(IPC_CHANNELS.hudState, handler);
  },
  sendHudIntent(intent: TCaptureHudIntent) {
    ipcRenderer.send(IPC_CHANNELS.hudIntent, intent);
  },
  onSessionExpired(handler) {
    return subscribe<void>(IPC_CHANNELS.sessionExpired, handler);
  },
  ipcRequest<TResult>(request: TIpcRequest): Promise<TIpcResponse<TResult>> {
    return ipcRenderer.invoke(IPC_CHANNELS.apiRequest, request);
  },
  signOut() {
    return ipcRenderer.invoke(IPC_CHANNELS.signOut);
  },
  signInWithGoogle() {
    return ipcRenderer.invoke(IPC_CHANNELS.googleSignIn);
  },
  cancelGoogleSignIn() {
    return ipcRenderer.invoke(IPC_CHANNELS.googleSignInCancel);
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
