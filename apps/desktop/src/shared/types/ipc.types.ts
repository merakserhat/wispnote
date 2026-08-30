import { TCaptureContext } from './capture.types';
import { TEngineAction, TToastFrame } from './engine.types';

export type TPanelMode = 'panel' | 'note';

export type TPanelPayload = {
  mode: TPanelMode;
  action: TEngineAction;
  context: TCaptureContext;
  canSync: boolean;
  summary: string;
};

export type TActionRequest = {
  action: TEngineAction;
  text?: string;
};

export type TToastPayload = Pick<TToastFrame, 'message' | 'detail'>;

export type TWispBridge = {
  onPanelRender: (handler: (payload: TPanelPayload) => void) => () => void;
  onToastShow: (handler: (payload: TToastPayload) => void) => () => void;
  onToastHide: (handler: () => void) => () => void;
  runAction: (request: TActionRequest) => Promise<unknown>;
  focusInput: () => void;
  dismiss: () => void;
};
