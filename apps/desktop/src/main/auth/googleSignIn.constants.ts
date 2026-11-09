import { TErrorResponse } from 'shared/types/common';

export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_SCOPES = 'openid email profile';
export const CALLBACK_HOST = '127.0.0.1';
export const CALLBACK_PATH = '/callback';
export const CALLBACK_TIMEOUT_MS = 120_000;

export const NOT_CONFIGURED_ERROR: TErrorResponse = {
  status: 0,
  errorCode: null,
  errorMessage: 'Google sign-in is not configured.',
};

export const CANCELLED_ERROR: TErrorResponse = {
  status: 0,
  errorCode: 'GOOGLE_SIGN_IN_CANCELLED',
  errorMessage: 'Google sign-in was cancelled.',
};

export const TIMED_OUT_ERROR: TErrorResponse = {
  status: 0,
  errorCode: 'GOOGLE_SIGN_IN_CANCELLED',
  errorMessage: 'Google sign-in timed out.',
};

export const DENIED_ERROR: TErrorResponse = {
  status: 0,
  errorCode: 'GOOGLE_LOGIN_FAILED',
  errorMessage: 'Google sign-in could not be completed. Please try again.',
};

const PAGE_STYLE =
  'font-family:-apple-system,BlinkMacSystemFont,sans-serif;display:flex;height:100vh;align-items:center;justify-content:center;margin:0;background:#f7f6f3;color:#1a1a1a';

export const SUCCESS_PAGE = `<!doctype html><html><body style="${PAGE_STYLE}"><p>Signed in. You can return to WispNote.</p></body></html>`;
export const FAILURE_PAGE = `<!doctype html><html><body style="${PAGE_STYLE}"><p>Google sign-in did not complete. You can close this tab and try again in WispNote.</p></body></html>`;
