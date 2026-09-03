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

export type TRefreshTokenRequestParams = {
  token: string;
};

export type TAuthState = {
  signedIn: boolean;
};
