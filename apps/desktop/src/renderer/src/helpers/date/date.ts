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

export function formatClockTime(date: string | Date): string {
  return new Date(date)
    .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    .toLowerCase();
}

export function formatDayLabel(date: string | Date, now: number = Date.now()): string {
  const target = new Date(date);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (target >= today) {
    return 'Today';
  }

  if (target >= yesterday) {
    return 'Yesterday';
  }

  return target.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
}
