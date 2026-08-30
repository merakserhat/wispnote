export const IPC_CHANNELS = {
  panelRender: 'panel:render',
  toastShow: 'toast:show',
  toastHide: 'toast:hide',
  action: 'action:run',
  focusInput: 'panel:focus-input',
  dismiss: 'panel:dismiss',
} as const;

export type TIpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
