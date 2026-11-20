import { isAccessError } from 'screens/Auth/Auth.helpers';

import ApiErrorCode from 'shared/enums/ApiErrorCode';
import { TEmailNotVerifiedError } from 'shared/types/auth.types';
import { TErrorResponse } from 'shared/types/common';

export function isEmailNotVerifiedError(
  error?: TErrorResponse | null
): error is TEmailNotVerifiedError {
  return error?.errorCode === ApiErrorCode.EMAIL_NOT_VERIFIED;
}

export function getSignInFormError(error?: TErrorResponse | null): TErrorResponse | null {
  if (!error || isEmailNotVerifiedError(error) || isAccessError(error)) {
    return null;
  }

  return error;
}
