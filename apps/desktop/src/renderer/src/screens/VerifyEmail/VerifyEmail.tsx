import { getRouteApi, useNavigate } from '@tanstack/react-router';

import Box from 'components/core/Box';

import { useVerifyEmailForm } from './VerifyEmail.hooks';
import VerificationCodeField from './views/VerificationCodeField';
import VerifyEmailAction from './views/VerifyEmailAction';
import VerifyEmailHeader from './views/VerifyEmailHeader';
import VerifyEmailLinks from './views/VerifyEmailLinks';
import VerifyEmailNotice from './views/VerifyEmailNotice';

const routeApi = getRouteApi('/auth-layout/verify-email');

function VerifyEmail() {
  const { email, verificationToken, codeExpiresIn, resendOnMount } = routeApi.useSearch();
  const navigate = useNavigate();

  function handleUseDifferentEmail() {
    navigate({ to: '/register' });
  }

  function handleSessionExpired() {
    navigate({ to: '/sign-in' });
  }

  const {
    control,
    submit,
    resend,
    notice,
    secondsLeft,
    codeLifetime,
    isExpired,
    isConfirmPending,
    isResendPending,
    isResendBlocked,
  } = useVerifyEmailForm({
    verificationToken,
    codeExpiresIn,
    resendOnMount,
    onSessionExpired: handleSessionExpired,
  });

  return (
    <Box
      height="100%"
      alignItems="center"
      justifyContent="center"
      backgroundColor="backgroundPrimary">
      <form onSubmit={submit}>
        <Box width={340} gap="m">
          <VerifyEmailHeader email={email} />
          <VerificationCodeField
            control={control}
            secondsLeft={secondsLeft}
            isExpired={isExpired}
          />
          <VerifyEmailNotice notice={notice} codeLifetime={codeLifetime} isExpired={isExpired} />
          <VerifyEmailAction
            isExpired={isExpired}
            isConfirmPending={isConfirmPending}
            isResendPending={isResendPending}
            isResendBlocked={isResendBlocked}
            onResend={resend}
          />
          <VerifyEmailLinks
            isExpired={isExpired}
            isResendBlocked={isResendBlocked}
            onResend={resend}
            onUseDifferentEmail={handleUseDifferentEmail}
          />
        </Box>
      </form>
    </Box>
  );
}

export default VerifyEmail;
