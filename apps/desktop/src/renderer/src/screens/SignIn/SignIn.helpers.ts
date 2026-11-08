import { TEmailNotVerifiedError } from 'shared/types/auth.types';
import { TErrorResponse } from 'shared/types/common';

export function isEmailNotVerifiedError(
  error?: TErrorResponse | null
): error is TEmailNotVerifiedError {
  return error?.errorCode === 'EMAIL_NOT_VERIFIED';
}
