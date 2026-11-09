import { useCallback, useEffect, useState } from 'react';

import { POLLING_PHASES, POLLING_STOPPED, POLLING_TICK_MS } from './usePolling.constants';
import { resolvePollingPhase } from './usePolling.helpers';
import { TUsePollingParams, TUsePollingReturn } from './usePolling.types';

function usePolling({
  phases = POLLING_PHASES,
  tickMs = POLLING_TICK_MS,
  autoStart = false,
}: TUsePollingParams = {}): TUsePollingReturn {
  const [startedAt, setStartedAt] = useState<number | undefined>(() =>
    autoStart ? Date.now() : undefined
  );
  const [now, setNow] = useState(() => Date.now());

  const elapsedMs = startedAt === undefined ? 0 : Math.max(0, now - startedAt);
  const phase = startedAt === undefined ? POLLING_STOPPED : resolvePollingPhase(elapsedMs, phases);
  const isPolling = startedAt !== undefined && !phase.isTimedOut;
  const isTicking = isPolling && phases.some((item) => item.untilMs !== undefined);

  useEffect(() => {
    if (!isTicking) {
      return undefined;
    }

    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), tickMs);

    return () => clearInterval(timer);
  }, [isTicking, tickMs]);

  const startPolling = useCallback((nextStartedAt: number = Date.now()) => {
    setNow(Date.now());
    setStartedAt(nextStartedAt);
  }, []);

  const stopPolling = useCallback(() => {
    setStartedAt(undefined);
  }, []);

  return {
    ...phase,
    isPolling,
    elapsedMs,
    now,
    startPolling,
    stopPolling,
  };
}

export default usePolling;
