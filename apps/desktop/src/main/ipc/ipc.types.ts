import { TActions } from '../actions';
import { TSettingsStore } from '../settings';

export type TIpcContext = {
  actions: TActions;
  settings: TSettingsStore;
};
