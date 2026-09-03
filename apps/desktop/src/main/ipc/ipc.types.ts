import { TActionRequest } from 'shared/types/ipc.types';

import { Engine } from '../engine';
import { MainWindow } from '../windows/mainWindow';
import { PanelWindow } from '../windows/panelWindow';

export type TIpcContext = {
  engine: Engine;
  panel: PanelWindow;
  mainWindow: MainWindow;
  getContext: () => unknown;
};

export type TRunActionParams = TIpcContext & {
  request: TActionRequest;
};
