import { TPollingPhase, TPollingPhaseState } from './usePolling.types';

export const POLLING_TICK_MS = 1_000;
export const POLLING_FAST_MS = 3_000;
export const POLLING_SLOW_MS = 10_000;
export const POLLING_SLOW_AFTER_MS = 45_000;
export const POLLING_TIMEOUT_MS = 180_000;

export const POLLING_PHASES: TPollingPhase[] = [
  { intervalMs: POLLING_FAST_MS, untilMs: POLLING_SLOW_AFTER_MS },
  { intervalMs: POLLING_SLOW_MS, untilMs: POLLING_TIMEOUT_MS },
];

export const POLLING_INFINITE_PHASES: TPollingPhase[] = [{ intervalMs: POLLING_SLOW_MS }];

export const POLLING_STOPPED: TPollingPhaseState = {
  refetchInterval: false,
  isSlow: false,
  isTimedOut: false,
};
