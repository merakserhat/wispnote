import { Control } from 'react-hook-form';

export type TVerifyEmailFormValues = {
  code: string;
};

export type TVerifyEmailProps = {
  email: string;
  verificationToken: string;
  codeExpiresIn?: number;
  resendOnMount?: boolean;
  onUseDifferentEmail: () => void;
  onSessionExpired: () => void;
};

export type TVerifyEmailNoticeTone = 'positive' | 'error';

export type TVerifyEmailNotice = {
  tone: TVerifyEmailNoticeTone;
  message: string;
};

export type TVerifyEmailHeaderProps = {
  email: string;
};

export type TVerificationCodeFieldProps = {
  control: Control<TVerifyEmailFormValues>;
  secondsLeft?: number;
  isExpired: boolean;
};

export type TVerifyEmailNoticeProps = {
  notice?: TVerifyEmailNotice;
  codeLifetime?: number;
  isExpired: boolean;
};

export type TVerifyEmailActionProps = {
  isExpired: boolean;
  isConfirmPending: boolean;
  isResendPending: boolean;
  isResendBlocked: boolean;
  onResend: () => void;
};

export type TVerifyEmailLinksProps = {
  isExpired: boolean;
  isResendBlocked: boolean;
  onResend: () => void;
  onUseDifferentEmail: () => void;
};
