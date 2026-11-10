import { ipcMain, webContents } from 'electron';

import { IPC_CHANNELS } from 'shared/constants/channels';
import { TCaptureHudIntent } from 'shared/types/captureHud.types';
import { TIpcRequest, TIpcResponse } from 'shared/types/ipc.types';
import { TAppearanceSettings } from 'shared/types/settings.types';

import { cancelGoogleSignIn, startGoogleSignIn } from '../auth';
import { onSessionExpired } from '../configs/requestConfig';
import { log } from '../helpers';
import storage from '../helpers/storage';
import { sendApiRequest, toErrorResponse, toIpcData } from './ipc.helpers';
import { TIpcContext } from './ipc.types';

export function registerIpcHandlers({ actions, settings }: TIpcContext): void {
  ipcMain.on(IPC_CHANNELS.hudIntent, async (_event, intent: TCaptureHudIntent) => {
    try {
      await actions.runIntent(intent);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log('error', `hud ${intent.type} failed: ${message}`);
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.apiRequest,
    async (_event, request: TIpcRequest): Promise<TIpcResponse<unknown>> => {
      try {
        const response = await sendApiRequest(request);
        return { ok: true, data: toIpcData(request, response) };
      } catch (error) {
        const failure = toErrorResponse(error);
        log('api', `${request.method} ${request.url} failed: ${failure.status}`);
        return { ok: false, error: failure };
      }
    }
  );

  ipcMain.handle(IPC_CHANNELS.signOut, () => {
    storage.removeTokens();
    log('auth', 'signed out');
  });

  ipcMain.handle(IPC_CHANNELS.googleSignIn, () => startGoogleSignIn());

  ipcMain.handle(IPC_CHANNELS.googleSignInCancel, () => cancelGoogleSignIn());

  ipcMain.handle(IPC_CHANNELS.settingsGet, () => settings.get());

  ipcMain.handle(IPC_CHANNELS.settingsSet, (_event, patch: Partial<TAppearanceSettings>) =>
    settings.update(patch)
  );

  onSessionExpired(() => {
    webContents.getAllWebContents().forEach((contents) => {
      contents.send(IPC_CHANNELS.sessionExpired);
    });
  });
}
