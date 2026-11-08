import { TEmailNotVerifiedError } from 'shared/types/auth.types';

export type TSignInFormValues = {
  email: string;
  password: string;
};

export type TSignInProps = {
  onRegister: () => void;
  onEmailNotVerified: (email: string, error: TEmailNotVerifiedError) => void;
};
