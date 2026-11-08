import * as yup from 'yup';

import { TThemePrimitives } from 'theme/theme.types';

import { TVerifyEmailFormValues, TVerifyEmailNoticeTone } from './VerifyEmail.types';

export const VERIFICATION_CODE_LENGTH = 6;

export const verifyEmailSchema = yup.object({
  code: yup
    .string()
    .required('Code is required')
    .matches(new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`), 'Code must be 6 digits'),
});

export const VERIFY_EMAIL_DEFAULT_VALUES: TVerifyEmailFormValues = {
  code: '',
};

export const RESENT_NOTICE = 'New code sent. Check your inbox.';
export const FROM_SIGN_IN_NOTICE = 'This account isn’t verified yet, so we just sent a new code.';

export const NOTICE_TONE_COLOR: Record<TVerifyEmailNoticeTone, keyof TThemePrimitives> = {
  positive: 'statusPositivePrimary',
  error: 'statusErrorPrimary',
};

export const COUNTDOWN_TICK_MS = 1000;
