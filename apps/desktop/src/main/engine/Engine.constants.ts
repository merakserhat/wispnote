/** Restart backoff, in ms, one step per consecutive failure. */
export const BACKOFF = [500, 1000, 2000, 5000, 10000];

/** Missed heartbeats before the engine is presumed wedged. */
export const MISSED_BEATS = 3;

/** Consecutive failures before we stop trying and surface it instead. */
export const MAX_FAILURES = 5;

/** A run that lasts this long is a success, whatever came before it. */
export const HEALTHY_UPTIME_MS = 30000;

/** Starting is slower than a heartbeat interval, so give it real room. */
export const STARTUP_GRACE_MS = 15000;

/** How long a `request` waits before giving up on a reply. */
export const REQUEST_TIMEOUT_MS = 15000;

/** How long `stop` waits for a graceful exit before SIGKILL. */
export const SHUTDOWN_TIMEOUT_MS = 2000;
