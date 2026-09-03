import { ipcMain, webContents } from 'electron';

import { IPC_CHANNELS } from 'shared/constants/channels';
import { TActionRequest, TIpcRequest, TIpcResponse } from 'shared/types/ipc.types';

import { onSessionExpired } from '../configs/requestConfig';
import { log } from '../helpers';
import storage from '../helpers/storage';
import { runAction, sendApiRequest, toErrorResponse, toIpcData } from './ipc.helpers';
import { TIpcContext } from './ipc.types';

export function registerIpcHandlers(context: TIpcContext): void {
  const { panel } = context;

  ipcMain.handle(IPC_CHANNELS.action, async (_event, request: TActionRequest) => {
    try {
      return await runAction({ ...context, request });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log('error', `action ${request.action} failed: ${message}`);
      return { error: message };
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

  onSessionExpired(() => {
    webContents.getAllWebContents().forEach((contents) => {
      contents.send(IPC_CHANNELS.sessionExpired);
    });
  });
}
