import { DAY_MS, HOUR_MS, MINUTE_MS, MONTH_MS } from './date.constants';

export function formatRelativeTime(date: string | Date, now: number = Date.now()): string {
  const elapsed = now - new Date(date).getTime();

  if (elapsed < MINUTE_MS) {
    return 'just now';
  }

  if (elapsed < HOUR_MS) {
    return `${Math.round(elapsed / MINUTE_MS)}m ago`;
  }

  if (elapsed < DAY_MS) {
    return `${Math.round(elapsed / HOUR_MS)}h ago`;
  }

  if (elapsed < MONTH_MS) {
    return `${Math.round(elapsed / DAY_MS)}d ago`;
  }

  return new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
