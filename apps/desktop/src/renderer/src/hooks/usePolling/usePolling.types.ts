export type TPollingPhase = {
  intervalMs: number;
  untilMs?: number;
};

export type TPollingPhaseState = {
  refetchInterval: number | false;
  isSlow: boolean;
  isTimedOut: boolean;
};

export type TUsePollingParams = {
  phases?: TPollingPhase[];
  tickMs?: number;
  autoStart?: boolean;
};

export type TUsePollingReturn = TPollingPhaseState & {
  isPolling: boolean;
  elapsedMs: number;
  now: number;
  startPolling: (startedAt?: number) => void;
  stopPolling: () => void;
};
