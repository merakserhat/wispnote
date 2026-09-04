import { TActions } from '../actions';
import { PanelWindow } from '../windows/panelWindow';

export type TIpcContext = {
  actions: TActions;
  panel: PanelWindow;
};
