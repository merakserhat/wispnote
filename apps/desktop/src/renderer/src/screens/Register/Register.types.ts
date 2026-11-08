import { TRegisterResponse } from 'shared/types/auth.types';

export type TRegisterFormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type TRegisterProps = {
  onSignIn: () => void;
  onRegistered: (email: string, result: TRegisterResponse) => void;
};
