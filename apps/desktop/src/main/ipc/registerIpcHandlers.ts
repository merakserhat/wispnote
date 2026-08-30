import { ipcMain } from 'electron';

import { IPC_CHANNELS } from 'shared/constants/channels';
import { TSaveResult } from 'shared/types/engine.types';
import { TListNotesResult } from 'shared/types/note.types';
import { TActionRequest } from 'shared/types/ipc.types';

import { Engine } from '../engine';
import { log } from '../helpers';
import { PanelWindow } from '../windows/panelWindow';
import { TIpcContext } from './ipc.types';

/**
 * Every action the panel can fire.
 *
 * The context is *not* re-captured here. The panel was rendered from a capture
 * the engine took before any window appeared; re-reading now would describe
 * this app instead of the article, so the stored payload is echoed back.
 */
const runAction = async (
  { action, text }: TActionRequest,
  engine: Engine,
  panel: PanelWindow,
  context: unknown
): Promise<unknown> => {
  switch (action) {
    case 'quick_highlight':
      panel.hide();
      return engine.request<TSaveResult>('save_highlight', { context });

    case 'quick_note': {
      const result = await engine.request<TSaveResult>('save_note', { context, text });
      panel.hide();
      return result;
    }

    case 'sync_source':
      panel.hide();
      return engine.request('sync_source', { context });

    case 'open_notes':
      // No notes screen yet - the reply is typed and logged, not rendered.
      panel.hide();
      return engine.request<TListNotesResult>('list_notes', { limit: 20 });

    default:
      panel.hide();
      return null;
  }
};

export const registerIpcHandlers = ({ engine, panel, getContext }: TIpcContext): void => {
  ipcMain.handle(IPC_CHANNELS.action, async (_event, request: TActionRequest) => {
    try {
      return await runAction(request, engine, panel, getContext());
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log('error', `action ${request.action} failed: ${message}`);
      return { error: message };
    }
  });

  // Switching the panel to note mode has to make the window key, and only the
  // main process can do that.
  ipcMain.on(IPC_CHANNELS.focusInput, () => panel.focus());

  ipcMain.on(IPC_CHANNELS.dismiss, () => panel.hide());
};
