import { POLLING_PHASES } from './usePolling.constants';
import { TPollingPhase, TPollingPhaseState } from './usePolling.types';

export function resolvePollingPhase(
  elapsedMs: number,
  phases: TPollingPhase[] = POLLING_PHASES
): TPollingPhaseState {
  const index = phases.findIndex(
    (phase) => phase.untilMs === undefined || elapsedMs < phase.untilMs
  );

  if (index === -1) {
    return { refetchInterval: false, isSlow: false, isTimedOut: true };
  }

  return { refetchInterval: phases[index].intervalMs, isSlow: index > 0, isTimedOut: false };
}
