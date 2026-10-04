import { ipcMain, webContents } from 'electron';

import { IPC_CHANNELS } from 'shared/constants/channels';
import { TActionRequest, TIpcRequest, TIpcResponse } from 'shared/types/ipc.types';
import { TAppearanceSettings } from 'shared/types/settings.types';

import { onSessionExpired } from '../configs/requestConfig';
import { log } from '../helpers';
import storage from '../helpers/storage';
import { sendApiRequest, toErrorResponse, toIpcData } from './ipc.helpers';
import { TIpcContext } from './ipc.types';

export function registerIpcHandlers({ actions, panel, settings }: TIpcContext): void {
  ipcMain.handle(IPC_CHANNELS.action, async (_event, request: TActionRequest) => {
    try {
      return await actions.runAction(request);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log('error', `action ${request.action} failed: ${message}`);
      return { accepted: false, reason: message };
    }
  });

  ipcMain.on(IPC_CHANNELS.focusInput, () => panel.focus());

  ipcMain.on(IPC_CHANNELS.dismiss, () => panel.hide());

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
