import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { TResendVerificationResponse } from 'shared/types/auth.types';
import { TErrorResponse } from 'shared/types/common';

import { useConfirmEmail, useResendVerification } from 'api/auth';

import {
  COUNTDOWN_TICK_MS,
  FROM_SIGN_IN_NOTICE,
  RESENT_NOTICE,
  VERIFY_EMAIL_DEFAULT_VALUES,
  verifyEmailSchema,
} from './VerifyEmail.constants';
import {
  isResendRejected,
  isSessionExpiredError,
  toExpiresAt,
  toSecondsLeft,
} from './VerifyEmail.helpers';
import { TVerifyEmailFormValues, TVerifyEmailNotice, TVerifyEmailProps } from './VerifyEmail.types';

export function useCountdown(expiresAt?: number) {
  const [secondsLeft, setSecondsLeft] = useState(() => toSecondsLeft(expiresAt));

  useEffect(() => {
    setSecondsLeft(toSecondsLeft(expiresAt));

    if (expiresAt === undefined) {
      return undefined;
    }

    const interval = setInterval(() => {
      setSecondsLeft(toSecondsLeft(expiresAt));
    }, COUNTDOWN_TICK_MS);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return secondsLeft;
}

export function useVerifyEmailForm({
  verificationToken,
  codeExpiresIn,
  resendOnMount = false,
  onSessionExpired,
}: Pick<
  TVerifyEmailProps,
  'verificationToken' | 'codeExpiresIn' | 'resendOnMount' | 'onSessionExpired'
>) {
  const { control, handleSubmit, setError, clearErrors, reset, watch } =
    useForm<TVerifyEmailFormValues>({
      resolver: yupResolver(verifyEmailSchema),
      defaultValues: VERIFY_EMAIL_DEFAULT_VALUES,
    });
  const [codeLifetime, setCodeLifetime] = useState(codeExpiresIn);
  const [expiresAt, setExpiresAt] = useState(() => toExpiresAt(codeExpiresIn));
  const [notice, setNotice] = useState<TVerifyEmailNotice>();
  const autoResendRef = useRef(resendOnMount);
  const didAutoResendRef = useRef(false);
  const secondsLeft = useCountdown(expiresAt);
  const code = watch('code');
  const isExpired = secondsLeft === 0;

  const { confirmEmail, isPending: isConfirmPending } = useConfirmEmail({
    onError: handleConfirmError,
  });
  const {
    resendVerification,
    isPending: isResendPending,
    error: resendError,
  } = useResendVerification({
    onSuccess: handleResendSuccess,
    onError: handleResendError,
  });

  useEffect(() => {
    setNotice((current) => (current?.tone === 'error' ? undefined : current));
  }, [code]);

  useEffect(() => {
    if (isExpired) {
      clearErrors('code');
      setNotice((current) => (current?.tone === 'positive' ? undefined : current));
    }
  }, [isExpired, clearErrors]);

  useEffect(() => {
    if (!resendOnMount || didAutoResendRef.current) {
      return;
    }

    didAutoResendRef.current = true;
    resendVerification({ verificationToken });
  }, [resendOnMount, resendVerification, verificationToken]);

  function handleConfirmError(error?: TErrorResponse) {
    if (!error) {
      return;
    }

    if (isSessionExpiredError(error)) {
      onSessionExpired();
      return;
    }

    setError('code', { message: error.errorMessage });
  }

  function handleResendSuccess(result?: TResendVerificationResponse) {
    if (!result) {
      return;
    }

    const wasAutoResend = autoResendRef.current;
    autoResendRef.current = false;

    setCodeLifetime(result.codeExpiresIn);
    setExpiresAt(toExpiresAt(result.codeExpiresIn));
    setNotice({ tone: 'positive', message: wasAutoResend ? FROM_SIGN_IN_NOTICE : RESENT_NOTICE });
    reset(VERIFY_EMAIL_DEFAULT_VALUES);
  }

  function handleResendError(error?: TErrorResponse) {
    autoResendRef.current = false;

    if (!error) {
      return;
    }

    if (isSessionExpiredError(error)) {
      onSessionExpired();
      return;
    }

    setNotice({ tone: 'error', message: error.errorMessage });
  }

  function resend() {
    resendVerification({ verificationToken });
  }

  const submit = handleSubmit((values) => confirmEmail({ verificationToken, code: values.code }));

  return {
    control,
    submit,
    resend,
    notice,
    secondsLeft,
    codeLifetime,
    isExpired,
    isConfirmPending,
    isResendPending,
    isResendBlocked: isResendPending || isResendRejected(resendError),
  };
}
