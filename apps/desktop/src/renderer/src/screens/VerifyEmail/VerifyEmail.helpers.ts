import { TErrorResponse } from 'shared/types/common';

export function toExpiresAt(codeExpiresIn?: number): number | undefined {
  if (codeExpiresIn === undefined) {
    return undefined;
  }

  return Date.now() + codeExpiresIn * 1000;
}

export function toSecondsLeft(expiresAt?: number): number | undefined {
  if (expiresAt === undefined) {
    return undefined;
  }

  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
}

export function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;

  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

export function toCodeLifetimeMinutes(codeExpiresIn: number): number {
  return Math.max(1, Math.round(codeExpiresIn / 60));
}

export function isSessionExpiredError(error: TErrorResponse): boolean {
  return error.status === 401;
}

export function isResendRejected(error: TErrorResponse | null): boolean {
  return error?.status === 422;
}
