import { useState } from 'react';

import { TEngineAction } from 'shared/types/engine.types';
import { TActionRequest } from 'shared/types/ipc.types';

import { TUseBridgeActionReturn } from './useBridgeAction.types';

function useBridgeAction(): TUseBridgeActionReturn {
  const [pendingAction, setPendingAction] = useState<TEngineAction | null>(null);

  async function run(request: TActionRequest) {
    setPendingAction(request.action);
    try {
      await window.wisp.runAction(request);
    } finally {
      setPendingAction(null);
    }
  }

  return { run, pendingAction };
}

export default useBridgeAction;
