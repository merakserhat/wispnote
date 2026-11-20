import { TEmailNotVerifiedError } from 'shared/types/auth.types';

export type TSignInFormValues = {
  email: string;
  password: string;
};

export type TUseSignInFormParams = {
  onEmailNotVerified: (email: string, error: TEmailNotVerifiedError) => void;
  onAccessPending: (email: string) => void;
  onAccessRejected: (email: string) => void;
};
