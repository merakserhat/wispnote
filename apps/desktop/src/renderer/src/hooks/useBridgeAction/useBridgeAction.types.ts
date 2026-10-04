import { TEngineAction } from 'shared/types/engine.types';
import { TActionRequest } from 'shared/types/ipc.types';

export type TUseBridgeActionReturn = {
  run: (request: TActionRequest) => Promise<void>;
  pendingAction: TEngineAction | null;
};
