import { TActionRequest } from 'shared/types/ipc.types';

import { Engine } from '../engine';
import { PanelWindow } from '../windows/panelWindow';

export type TIpcContext = {
  engine: Engine;
  panel: PanelWindow;
  getContext: () => unknown;
};

export type TRunActionParams = TIpcContext & {
  request: TActionRequest;
};
