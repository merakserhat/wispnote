import { TActions } from '../actions';
import { TSettingsStore } from '../settings';
import { PanelWindow } from '../windows/panelWindow';

export type TIpcContext = {
  actions: TActions;
  panel: PanelWindow;
  settings: TSettingsStore;
};
