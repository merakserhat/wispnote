import { ipcRenderer } from 'electron';

export function subscribe<TPayload>(
  channel: string,
  handler: (payload: TPayload) => void
): () => void {
  function listener(_event: Electron.IpcRendererEvent, payload: TPayload): void {
    handler(payload);
  }

  ipcRenderer.on(channel, listener);

  function unsubscribe(): void {
    ipcRenderer.removeListener(channel, listener);
  }

  return unsubscribe;
}
