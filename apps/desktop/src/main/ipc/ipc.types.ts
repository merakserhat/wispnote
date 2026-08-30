import { Engine } from '../engine';
import { PanelWindow } from '../windows/panelWindow';

export type TIpcContext = {
  engine: Engine;
  panel: PanelWindow;
  /** The raw capture the panel is currently rendered from. */
  getContext: () => unknown;
};
