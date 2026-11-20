import ApiErrorCode from 'shared/enums/ApiErrorCode';
import { TErrorResponse } from 'shared/types/common';

export function isAccessError(error?: TErrorResponse | null): boolean {
  return (
    error?.errorCode === ApiErrorCode.ACCESS_PENDING ||
    error?.errorCode === ApiErrorCode.ACCESS_REJECTED
  );
}
