import { TErrorResponse } from './common';

export type TTokenResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type TMember = {
  id: string;
  email: string;
};

export type TLoginRequestParams = {
  email: string;
  password: string;
};

export type TRegisterRequestParams = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type TRegisterResponse = {
  id: string;
  email: string;
  verificationToken: string;
  verificationTokenExpiresIn: number;
  codeExpiresIn: number;
};

export type TEmailNotVerifiedError = TErrorResponse & {
  verificationToken: string;
  verificationTokenExpiresIn: number;
};

export type TConfirmEmailRequestParams = {
  verificationToken: string;
  code: string;
};

export type TResendVerificationRequestParams = {
  verificationToken: string;
};

export type TResendVerificationResponse = {
  codeExpiresIn: number;
};

export type TRefreshTokenRequestParams = {
  token: string;
};

export type TAuthState = {
  signedIn: boolean;
};
