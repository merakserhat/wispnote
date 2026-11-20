import { TActions } from '../actions';
import { TQuickPaste } from '../quickPaste';
import { TSettingsStore } from '../settings';

export type TIpcContext = {
  actions: TActions;
  quickPaste: TQuickPaste;
  settings: TSettingsStore;
};
